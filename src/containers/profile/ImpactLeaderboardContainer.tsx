import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../api/profile.api';
import { extractErrorMessage } from '../../utils/error.util';
import {
  ImpactLeaderboardData,
  LeaderboardEntry,
} from '../../types/profile.types';
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { SideBurgerMenuModal } from '../../components/common/SideBurgerMenuModal';
import { AppVectorIcon } from '../../components/common/AppVectorIcon';
import { LeaderboardSkeleton } from '../../components/common/AppSkeleton';

type LeaderboardTabMode = 'NEARBY' | 'TOP';

export const ImpactLeaderboardContainer: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();

  const [data, setData] = useState<ImpactLeaderboardData | null>(null);
  const [activeTab, setActiveTab] = useState<LeaderboardTabMode>('NEARBY');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadLeaderboard = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      setErrorMsg(null);

      try {
        const res = await profileApi.getImpactLeaderboard(
          user
            ? { id: user.id, name: user.name, location: user.location }
            : undefined,
        );
        setData(res);
      } catch (err) {
        setErrorMsg(extractErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard(false);
    }, [loadLeaderboard]),
  );

  const myEntry = data?.currentUserEntry ?? null;
  const topList = data?.topVolunteers ?? [];
  const nearbyList = data?.nearbyVolunteers ?? [];

  const nextTargetAbove =
    myEntry && myEntry.rank > 1
      ? nearbyList.find((item) => item.rank === myEntry.rank - 1) ??
        topList.find((item) => item.rank === myEntry.rank - 1) ??
        null
      : null;

  const pointsToNextRank =
    nextTargetAbove && myEntry
      ? Math.max(1, nextTargetAbove.impactScore - myEntry.impactScore + 1)
      : 0;

  const firstPlace = topList[0] ?? null;
  const secondPlace = topList[1] ?? null;
  const thirdPlace = topList[2] ?? null;

  const renderRankBadge = (rank: number, isCurrent: boolean) => {
    if (rank === 1) {
      return (
        <AppVectorIcon
          name="crown"
          size={17}
          color={isCurrent ? COLORS.background : '#FFC107'}
        />
      );
    }
    if (rank === 2) {
      return (
        <AppVectorIcon
          name="trophy"
          size={16}
          color={isCurrent ? COLORS.background : '#CBD5E1'}
        />
      );
    }
    if (rank === 3) {
      return (
        <AppVectorIcon
          name="trophy"
          size={16}
          color={isCurrent ? COLORS.background : '#D97706'}
        />
      );
    }
    return (
      <Text
        style={[
          styles.rankNumberText,
          isCurrent && { color: COLORS.background },
        ]}
      >
        #{rank}
      </Text>
    );
  };

  const renderVolunteerRow = (
    item: LeaderboardEntry,
    showGapToMe = false,
  ) => {
    const initials = (item.name || 'مت')
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const scoreDiff =
      myEntry && !item.isCurrentUser
        ? item.impactScore - myEntry.impactScore
        : 0;

    return (
      <View
        key={item.userId}
        style={[
          styles.rowCard,
          item.isCurrentUser && styles.rowCardCurrentUser,
          item.rank === 1 && !item.isCurrentUser && styles.rowCardFirstPlace,
        ]}
      >
        <View style={styles.rowRight}>
          <View
            style={[
              styles.rankBadgeBox,
              item.isCurrentUser && styles.rankBadgeBoxCurrent,
            ]}
          >
            {renderRankBadge(item.rank, item.isCurrentUser)}
          </View>

          <View
            style={[
              styles.rowAvatar,
              item.isCurrentUser && styles.rowAvatarCurrent,
            ]}
          >
            <Text style={styles.rowAvatarText}>{initials}</Text>
          </View>

          <View style={styles.rowInfoCol}>
            <View style={styles.nameWithTagRow}>
              <Text
                style={[
                  styles.rowName,
                  item.isCurrentUser && styles.rowNameCurrent,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {item.isCurrentUser && (
                <View style={styles.youTag}>
                  <Text style={styles.youTagText}>أنت</Text>
                </View>
              )}
            </View>

            <Text style={styles.rowSubMeta} numberOfLines={1}>
              {item.hoursCount} ساعة • {item.completedProjectsCount} مشاريع
              {item.location ? ` • ${item.location}` : ''}
            </Text>

            {showGapToMe && !item.isCurrentUser && myEntry && (
              <Text
                style={[
                  styles.gapHintText,
                  scoreDiff > 0 ? styles.gapAboveText : styles.gapBelowText,
                ]}
              >
                {scoreDiff > 0
                  ? `يسبقك بـ ${scoreDiff} نقطة أثر`
                  : scoreDiff < 0
                  ? `تتقدم عليه بـ ${Math.abs(scoreDiff)} نقطة`
                  : 'متعادل معك في نقاط الأثر'}
              </Text>
            )}
          </View>
        </View>

        <View
          style={[
            styles.scorePill,
            item.isCurrentUser && styles.scorePillCurrent,
          ]}
        >
          <Text
            style={[
              styles.scorePillValue,
              item.isCurrentUser && styles.scorePillValueCurrent,
            ]}
          >
            {item.impactScore}
          </Text>
          <Text
            style={[
              styles.scorePillUnit,
              item.isCurrentUser && styles.scorePillValueCurrent,
            ]}
          >
            نقطة
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.burgerBtn}
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.burgerLine} />
          <View style={[styles.burgerLine, styles.burgerLineMiddle]} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>

        <View style={styles.navTitleRow}>
          <AppVectorIcon name="trophy" size={18} color={COLORS.primary} />
          <Text style={styles.navTitle}>لوحة الصدارة وترتيب الأثر</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>رجوع</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadLeaderboard(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <ErrorBanner message={errorMsg} />

        {loading ? (
  <LeaderboardSkeleton />
) :!myEntry || topList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              لا يوجد متطوعون مسجلون في قاعدة البيانات حالياً
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.myRankHeroCard}>
              <View style={styles.myRankTopRow}>
                <View style={styles.myRankCircle}>
                  <Text style={styles.myRankCircleLabel}>الترتيب</Text>
                  <Text style={styles.myRankCircleValue}>#{myEntry.rank}</Text>
                </View>

                <View style={styles.myRankTextCol}>
                  <Text style={styles.myRankGreeting}>
                    مركزك الفعلي في قاعدة بيانات أثر
                  </Text>
                  <Text style={styles.myRankBadgeTitle}>
                    {myEntry.rankTitle.replace(/[💎🥇🥈🌱⭐]/g, '').trim()}
                  </Text>
                  <Text style={styles.myRankTotalSub}>
                    إجمالي المتطوعين المسجلين:{' '}
                    {data?.totalVolunteers ?? topList.length}
                  </Text>
                </View>
              </View>

              <View style={styles.myStatsMiniRow}>
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatValue}>
                    {myEntry.impactScore}
                  </Text>
                  <Text style={styles.miniStatLabel}>نقاط أثرك</Text>
                </View>
                <View style={styles.miniStatDivider} />
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatValue}>
                    {myEntry.hoursCount} س
                  </Text>
                  <Text style={styles.miniStatLabel}>ساعات معتمدة</Text>
                </View>
                <View style={styles.miniStatDivider} />
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatValue}>
                    {myEntry.completedProjectsCount}
                  </Text>
                  <Text style={styles.miniStatLabel}>مهام مكتملة</Text>
                </View>
              </View>

              {nextTargetAbove ? (
                <View style={styles.nextTargetBanner}>
                  <Text style={styles.nextTargetText}>
                    يفصلك{' '}
                    <Text style={styles.nextTargetHighlight}>
                      {pointsToNextRank} نقطة
                    </Text>{' '}
                    فقط لتجاوز ({nextTargetAbove.name}) والوصول إلى المركز #
                    {nextTargetAbove.rank}!
                  </Text>
                </View>
              ) : (
                <View style={styles.nextTargetBanner}>
                  <Text style={styles.nextTargetText}>
                    أنت في صدارة متطوعي منصة أثر! واصل عطاءك المتميز.
                  </Text>
                </View>
              )}
            </View>

            {firstPlace && (
              <View style={styles.podiumSection}>
                <View style={styles.podiumHeaderRow}>
                  <AppVectorIcon name="crown" size={18} color="#FFC107" />
                  <Text style={styles.sectionTitle}>
                    منصة التتويج لأبطال الأثر
                  </Text>
                </View>

                <View style={styles.podiumRow}>
                  {secondPlace ? (
                    <View style={styles.podiumCol}>
                      <AppVectorIcon name="trophy" size={16} color="#CBD5E1" />
                      <View style={[styles.podiumAvatar, styles.podiumSilver]}>
                        <Text style={styles.podiumAvatarText}>
                          {secondPlace.name.slice(0, 2)}
                        </Text>
                      </View>
                      <Text style={styles.podiumName} numberOfLines={1}>
                        {secondPlace.name}
                      </Text>
                      <Text style={styles.podiumScore}>
                        {secondPlace.impactScore} نقطة
                      </Text>
                      <View style={[styles.podiumPedestal, styles.pedestal2]}>
                        <Text style={styles.pedestalNumber}>2</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.podiumCol} />
                  )}

                  <View style={[styles.podiumCol, styles.podiumColCenter]}>
                    <AppVectorIcon name="crown" size={20} color="#FFC107" />
                    <View style={[styles.podiumAvatar, styles.podiumGold]}>
                      <Text style={styles.podiumAvatarTextGold}>
                        {firstPlace.name.slice(0, 2)}
                      </Text>
                    </View>
                    <Text style={styles.podiumNameGold} numberOfLines={1}>
                      {firstPlace.name}
                    </Text>
                    <Text style={styles.podiumScoreGold}>
                      {firstPlace.impactScore} نقطة
                    </Text>
                    <View style={[styles.podiumPedestal, styles.pedestal1]}>
                      <Text style={styles.pedestalNumberGold}>1</Text>
                    </View>
                  </View>

                  {thirdPlace ? (
                    <View style={styles.podiumCol}>
                      <AppVectorIcon name="trophy" size={16} color="#D97706" />
                      <View style={[styles.podiumAvatar, styles.podiumBronze]}>
                        <Text style={styles.podiumAvatarText}>
                          {thirdPlace.name.slice(0, 2)}
                        </Text>
                      </View>
                      <Text style={styles.podiumName} numberOfLines={1}>
                        {thirdPlace.name}
                      </Text>
                      <Text style={styles.podiumScore}>
                        {thirdPlace.impactScore} نقطة
                      </Text>
                      <View style={[styles.podiumPedestal, styles.pedestal3]}>
                        <Text style={styles.pedestalNumber}>3</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.podiumCol} />
                  )}
                </View>
              </View>
            )}

            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'NEARBY' && styles.tabBtnActive,
                ]}
                onPress={() => setActiveTab('NEARBY')}
                activeOpacity={0.85}
              >
                <AppVectorIcon
                  name="target"
                  size={14}
                  color={
                    activeTab === 'NEARBY'
                      ? COLORS.background
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    activeTab === 'NEARBY' && styles.tabBtnTextActive,
                  ]}
                >
                  قريبون من أثرك ({nearbyList.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'TOP' && styles.tabBtnActive,
                ]}
                onPress={() => setActiveTab('TOP')}
                activeOpacity={0.85}
              >
                <AppVectorIcon
                  name="trophy"
                  size={14}
                  color={
                    activeTab === 'TOP'
                      ? COLORS.background
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    activeTab === 'TOP' && styles.tabBtnTextActive,
                  ]}
                >
                  جميع المتطوعين ({topList.length})
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'NEARBY' ? (
              <View style={styles.listSection}>
                <View style={styles.listHeaderBox}>
                  <Text style={styles.sectionTitle}>
                    متطوعون قريبون من مستوى أثرك
                  </Text>
                  <Text style={styles.sectionSub}>
                    المتطوعون المسجلون الأقرب لنقاط أثرك الحالية في قاعدة البيانات
                  </Text>
                </View>

                <View style={styles.rowsStack}>
                  {nearbyList.map((item) => renderVolunteerRow(item, true))}
                </View>
              </View>
            ) : (
              <View style={styles.listSection}>
                <View style={styles.listHeaderBox}>
                  <Text style={styles.sectionTitle}>
                    ترتيب المتطوعين الأعلى أثراً
                  </Text>
                  <Text style={styles.sectionSub}>
                    جميع المتطوعين المسجلين مرتبين حسب الساعات والمشاريع المعتمدة
                  </Text>
                </View>

                <View style={styles.rowsStack}>
                  {topList.map((item) => renderVolunteerRow(item, false))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <SideBurgerMenuModal
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        userName={user?.name ?? 'مستخدم أثر'}
        userEmail={user?.email}
        userRole={user?.role}
        onNavigateRank={() => setMenuOpen(false)}
        onNavigateStatsReport={() => navigation.navigate('UserStatsReport')}
        onNavigateMarketplace={() => navigation.navigate('MarketplaceRewards')}
        onNavigateProfile={() =>
          navigation.navigate('MainTabs', { screen: 'ProfileTab' })
        }
        onSignOut={signOut}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topNav: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  burgerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  burgerLine: {
    width: 18,
    height: 2.2,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  burgerLineMiddle: {
    width: 13,
    alignSelf: 'center',
  },
  navTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnText: {
    color: COLORS.text,
    fontSize: 13.5,
    fontWeight: '700',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  loaderBox: {
    paddingVertical: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  myRankHeroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 14,
  },
  myRankTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  myRankCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myRankCircleLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.background,
    opacity: 0.9,
  },
  myRankCircleValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.background,
  },
  myRankTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  myRankGreeting: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  myRankBadgeTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'right',
  },
  myRankTotalSub: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  myStatsMiniRow: {
    flexDirection: 'row-reverse',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  miniStatBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  miniStatValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  miniStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  miniStatDivider: {
    width: 1,
    height: 26,
    backgroundColor: COLORS.border,
  },
  nextTargetBanner: {
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 186, 102, 0.35)',
  },
  nextTargetText: {
    fontSize: 12.5,
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 19,
    fontWeight: '600',
  },
  nextTargetHighlight: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  podiumSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  podiumHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  podiumRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 8,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  podiumColCenter: {
    flex: 1.15,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  podiumGold: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 193, 7, 0.18)',
    borderColor: '#FFC107',
  },
  podiumSilver: {
    backgroundColor: 'rgba(203, 213, 225, 0.15)',
    borderColor: '#CBD5E1',
  },
  podiumBronze: {
    backgroundColor: 'rgba(217, 119, 6, 0.16)',
    borderColor: '#D97706',
  },
  podiumAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  podiumAvatarTextGold: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFC107',
  },
  podiumName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  podiumNameGold: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFC107',
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  podiumScoreGold: {
    fontSize: 12.5,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 6,
  },
  podiumPedestal: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedestal1: {
    height: 66,
    backgroundColor: 'rgba(0, 186, 102, 0.24)',
    borderTopWidth: 2,
    borderColor: COLORS.primary,
  },
  pedestal2: {
    height: 48,
    backgroundColor: COLORS.surfaceLight,
    borderTopWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  pedestal3: {
    height: 38,
    backgroundColor: COLORS.surfaceLight,
    borderTopWidth: 1.5,
    borderColor: '#D97706',
  },
  pedestalNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textSecondary,
  },
  pedestalNumberGold: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  tabsContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.background,
    fontWeight: '900',
  },
  listSection: {
    gap: 12,
  },
  listHeaderBox: {
    alignItems: 'flex-end',
    gap: 3,
  },
  sectionTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sectionSub: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowsStack: {
    gap: 10,
  },
  rowCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  rowCardCurrentUser: {
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  rowCardFirstPlace: {
    borderColor: 'rgba(255, 193, 7, 0.5)',
  },
  rowRight: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  rankBadgeBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeBoxCurrent: {
    backgroundColor: COLORS.primary,
  },
  rankNumberText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },
  rowAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  rowAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  rowInfoCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  nameWithTagRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  rowNameCurrent: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  youTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  youTagText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: COLORS.background,
  },
  rowSubMeta: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  gapHintText: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  gapAboveText: {
    color: '#FFC107',
  },
  gapBelowText: {
    color: COLORS.primary,
  },
  scorePill: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 68,
  },
  scorePillCurrent: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  scorePillValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
  },
  scorePillUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  scorePillValueCurrent: {
    color: COLORS.background,
  },
});