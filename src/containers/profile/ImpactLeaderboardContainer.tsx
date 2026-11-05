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
import { useTheme } from '../../context/ThemeContext';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { SideBurgerMenuModal } from '../../components/common/SideBurgerMenuModal';
import { AppVectorIcon } from '../../components/common/AppVectorIcon';
import { LeaderboardSkeleton } from '../../components/common/AppSkeleton';

type LeaderboardTabMode = 'NEARBY' | 'TOP';

export const ImpactLeaderboardContainer: React.FC = () => {
  const { colors } = useTheme();
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
          color={isCurrent ? colors.background : '#FFC107'}
        />
      );
    }
    if (rank === 2) {
      return (
        <AppVectorIcon
          name="trophy"
          size={16}
          color={isCurrent ? colors.background : '#CBD5E1'}
        />
      );
    }
    if (rank === 3) {
      return (
        <AppVectorIcon
          name="trophy"
          size={16}
          color={isCurrent ? colors.background : '#D97706'}
        />
      );
    }
    return (
      <Text
        style={[
          styles.rankNumberText,
          { color: colors.text },
          isCurrent && { color: colors.background },
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
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          item.isCurrentUser && {
            backgroundColor: 'rgba(0, 186, 102, 0.14)',
            borderColor: colors.primary,
            borderWidth: 1.5,
          },
          item.rank === 1 && !item.isCurrentUser && styles.rowCardFirstPlace,
        ]}
      >
        <View style={styles.rowRight}>
          <View
            style={[
              styles.rankBadgeBox,
              { backgroundColor: colors.surfaceLight },
              item.isCurrentUser && { backgroundColor: colors.primary },
            ]}
          >
            {renderRankBadge(item.rank, item.isCurrentUser)}
          </View>

          <View
            style={[
              styles.rowAvatar,
              {
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border,
              },
              item.isCurrentUser && {
                borderColor: colors.primary,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Text style={[styles.rowAvatarText, { color: colors.primary }]}>
              {initials}
            </Text>
          </View>

          <View style={styles.rowInfoCol}>
            <View style={styles.nameWithTagRow}>
              <Text
                style={[
                  styles.rowName,
                  { color: colors.text },
                  item.isCurrentUser && { color: colors.primary, fontWeight: '900' },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {item.isCurrentUser && (
                <View style={[styles.youTag, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.youTagText, { color: colors.background }]}>أنت</Text>
                </View>
              )}
            </View>

            <Text style={[styles.rowSubMeta, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.hoursCount} ساعة • {item.completedProjectsCount} مشاريع
              {item.location ? ` • ${item.location}` : ''}
            </Text>

            {showGapToMe && !item.isCurrentUser && myEntry && (
              <Text
                style={[
                  styles.gapHintText,
                  scoreDiff > 0 ? styles.gapAboveText : { color: colors.primary },
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
            { backgroundColor: colors.surfaceLight, borderColor: colors.border },
            item.isCurrentUser && { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.scorePillValue,
              { color: colors.primary },
              item.isCurrentUser && { color: colors.background },
            ]}
          >
            {item.impactScore}
          </Text>
          <Text
            style={[
              styles.scorePillUnit,
              { color: colors.textSecondary },
              item.isCurrentUser && { color: colors.background },
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
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" />

      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <TouchableOpacity
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: colors.surfaceLight,
            borderWidth: 1.5,
            borderColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.8}
        >
          <View style={[styles.burgerLine, { backgroundColor: colors.primary }]} />
          <View style={[styles.burgerLine, styles.burgerLineMiddle, { backgroundColor: colors.primary }]} />
          <View style={[styles.burgerLine, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>

        <View style={styles.navTitleRow}>
          <AppVectorIcon name="trophy" size={18} color={colors.primary} />
          <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>
            لوحة الصدارة وترتيب الأثر
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.surfaceLight,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={{ color: colors.text, fontSize: 13.5, fontWeight: '700' }}>رجوع</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadLeaderboard(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <ErrorBanner message={errorMsg} />

        {loading ? (
  <LeaderboardSkeleton />
) :!myEntry || topList.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 18,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 15, fontWeight: '800', color: colors.textSecondary, textAlign: 'center' }}
            >
              لا يوجد متطوعون مسجلون في قاعدة البيانات حالياً
            </Text>
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 22,
                padding: 18,
                borderWidth: 1.5,
                borderColor: colors.primary,
                gap: 14,
              }}
            >
              <View style={styles.myRankTopRow}>
                <View
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 20,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{ fontSize: 10.5, fontWeight: '800', color: colors.background, opacity: 0.9 }}
                  >
                    الترتيب
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: colors.background }}>
                    #{myEntry.rank}
                  </Text>
                </View>

                <View style={styles.myRankTextCol}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary }}>
                    مركزك الفعلي في قاعدة بيانات أثر
                  </Text>
                  <Text
                    style={{ fontSize: 17.5, fontWeight: '900', color: colors.text, textAlign: 'right' }}
                  >
                    {myEntry.rankTitle.replace(/[💎🥇🥈🌱⭐]/g, '').trim()}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>
                    إجمالي المتطوعين المسجلين:{' '}
                    {data?.totalVolunteers ?? topList.length}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row-reverse',
                  backgroundColor: colors.surfaceLight,
                  borderRadius: 14,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                }}
              >
                <View style={styles.miniStatBox}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: colors.primary }}>
                    {myEntry.impactScore}
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>
                    نقاط أثرك
                  </Text>
                </View>
                <View style={[styles.miniStatDivider, { backgroundColor: colors.border }]} />
                <View style={styles.miniStatBox}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: colors.primary }}>
                    {myEntry.hoursCount} س
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>
                    ساعات معتمدة
                  </Text>
                </View>
                <View style={[styles.miniStatDivider, { backgroundColor: colors.border }]} />
                <View style={styles.miniStatBox}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: colors.primary }}>
                    {myEntry.completedProjectsCount}
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>
                    مهام مكتملة
                  </Text>
                </View>
              </View>

              {nextTargetAbove ? (
                <View style={styles.nextTargetBanner}>
                  <Text style={[styles.nextTargetText, { color: colors.text }]}>
                    يفصلك{' '}
                    <Text style={{ color: colors.primary, fontWeight: '900' }}>
                      {pointsToNextRank} نقطة
                    </Text>{' '}
                    فقط لتجاوز ({nextTargetAbove.name}) والوصول إلى المركز #
                    {nextTargetAbove.rank}!
                  </Text>
                </View>
              ) : (
                <View style={styles.nextTargetBanner}>
                  <Text style={[styles.nextTargetText, { color: colors.text }]}>
                    أنت في صدارة متطوعي منصة أثر! واصل عطاءك المتميز.
                  </Text>
                </View>
              )}
            </View>

            {firstPlace && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 22,
                  paddingTop: 18,
                  paddingHorizontal: 14,
                  paddingBottom: 0,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: 'hidden',
                }}
              >
                <View style={styles.podiumHeaderRow}>
                  <AppVectorIcon name="crown" size={18} color="#FFC107" />
                  <Text style={{ fontSize: 17.5, fontWeight: '900', color: colors.text, textAlign: 'right', writingDirection: 'rtl' }}>
                    منصة التتويج لأبطال الأثر
                  </Text>
                </View>

                <View style={styles.podiumRow}>
                  {secondPlace ? (
                    <View style={styles.podiumCol}>
                      <AppVectorIcon name="trophy" size={16} color="#CBD5E1" />
                      <View style={[styles.podiumAvatar, styles.podiumSilver]}>
                        <Text style={[styles.podiumAvatarText, { color: colors.text }]}>
                          {secondPlace.name.slice(0, 2)}
                        </Text>
                      </View>
                      <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                        {secondPlace.name}
                      </Text>
                      <Text style={[styles.podiumScore, { color: colors.textSecondary }]}>
                        {secondPlace.impactScore} نقطة
                      </Text>
                      <View style={[styles.podiumPedestal, styles.pedestal2, { backgroundColor: colors.surfaceLight }]}>
                        <Text style={[styles.pedestalNumber, { color: colors.textSecondary }]}>2</Text>
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
                    <Text style={[styles.podiumScoreGold, { color: colors.primary }]}>
                      {firstPlace.impactScore} نقطة
                    </Text>
                    <View style={[styles.podiumPedestal, styles.pedestal1, { borderColor: colors.primary }]}>
                      <Text style={[styles.pedestalNumberGold, { color: colors.primary }]}>1</Text>
                    </View>
                  </View>

                  {thirdPlace ? (
                    <View style={styles.podiumCol}>
                      <AppVectorIcon name="trophy" size={16} color="#D97706" />
                      <View style={[styles.podiumAvatar, styles.podiumBronze]}>
                        <Text style={[styles.podiumAvatarText, { color: colors.text }]}>
                          {thirdPlace.name.slice(0, 2)}
                        </Text>
                      </View>
                      <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                        {thirdPlace.name}
                      </Text>
                      <Text style={[styles.podiumScore, { color: colors.textSecondary }]}>
                        {thirdPlace.impactScore} نقطة
                      </Text>
                      <View style={[styles.podiumPedestal, styles.pedestal3, { backgroundColor: colors.surfaceLight }]}>
                        <Text style={[styles.pedestalNumber, { color: colors.textSecondary }]}>3</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.podiumCol} />
                  )}
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row-reverse',
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 5,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 6,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'NEARBY' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setActiveTab('NEARBY')}
                activeOpacity={0.85}
              >
                <AppVectorIcon
                  name="target"
                  size={14}
                  color={
                    activeTab === 'NEARBY'
                      ? colors.background
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    { color: colors.textSecondary },
                    activeTab === 'NEARBY' && { color: colors.background, fontWeight: '900' },
                  ]}
                >
                  قريبون من أثرك ({nearbyList.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'TOP' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setActiveTab('TOP')}
                activeOpacity={0.85}
              >
                <AppVectorIcon
                  name="trophy"
                  size={14}
                  color={
                    activeTab === 'TOP'
                      ? colors.background
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    { color: colors.textSecondary },
                    activeTab === 'TOP' && { color: colors.background, fontWeight: '900' },
                  ]}
                >
                  جميع المتطوعين ({topList.length})
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'NEARBY' ? (
              <View style={styles.listSection}>
                <View style={styles.listHeaderBox}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    متطوعون قريبون من مستوى أثرك
                  </Text>
                  <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
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
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    ترتيب المتطوعين الأعلى أثراً
                  </Text>
                  <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
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
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  burgerLine: {
    width: 18,
    height: 2.2,
    borderRadius: 2,
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
  myRankTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  myRankTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  miniStatBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  miniStatDivider: {
    width: 1,
    height: 26,
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
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 19,
    fontWeight: '600',
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
  },
  podiumAvatarTextGold: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFC107',
  },
  podiumName: {
    fontSize: 12.5,
    fontWeight: '800',
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
    marginBottom: 6,
  },
  podiumScoreGold: {
    fontSize: 12.5,
    fontWeight: '900',
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
    borderColor: '#00BA66',
  },
  pedestal2: {
    height: 48,
    borderTopWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  pedestal3: {
    height: 38,
    borderTopWidth: 1.5,
    borderColor: '#D97706',
  },
  pedestalNumber: {
    fontSize: 17,
    fontWeight: '900',
  },
  pedestalNumberGold: {
    fontSize: 22,
    fontWeight: '900',
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
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
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
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sectionSub: {
    fontSize: 12.5,
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
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    gap: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: 13,
    fontWeight: '900',
  },
  rowAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: {
    fontSize: 14,
    fontWeight: '800',
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
    textAlign: 'right',
  },
  youTag: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  youTagText: {
    fontSize: 10.5,
    fontWeight: '900',
  },
  rowSubMeta: {
    fontSize: 11.5,
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
  scorePill: {
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 68,
  },
  scorePillValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  scorePillUnit: {
    fontSize: 10,
    fontWeight: '700',
  },
});
