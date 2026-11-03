import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { profileApi } from '../../api/profile.api';
import { extractErrorMessage } from '../../utils/error.util';
import { RewardTutorialItem, UserProfileStats } from '../../types/profile.types';
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { MarketplaceRewardsSection } from '../../components/profile/MarketplaceRewardsSection';

export const MarketplaceRewardsContainer: React.FC = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState<UserProfileStats>({
    volunteerScore: 150,
    hoursCount: 0,
    projectsCompletedCount: 0,
    rankTitle: 'متطوع مبادر 🌱',
  });
  const [tutorials, setTutorials] = useState<RewardTutorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const [statsData, tutData] = await Promise.all([
        profileApi.getProfileStats(),
        profileApi.listRewardTutorials(),
      ]);
      setStats(statsData);
      setTutorials(Array.isArray(tutData) ? tutData : []);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRedeem = async (tutorialId: string, cost: number) => {
    if (stats.volunteerScore < cost) {
      Alert.alert('عذراً', 'رصيد نقاطك غير كافٍ لاستبدال هذه الدورة.');
      return;
    }

    Alert.alert(
      'تأكيد الاستبدال',
      `هل أنت متأكد من رغبتك في خصم ${cost} نقطة لفتح هذه الدورة التدريبية؟`,
      [
        { text: 'تراجع', style: 'cancel' },
        {
          text: 'نعم، استبدال',
          onPress: async () => {
            setRedeemingId(tutorialId);
            setErrorMsg(null);
            try {
              await profileApi.redeemReward(tutorialId, cost);
              Alert.alert(
                'مبروك! 🎉',
                'تم خصم النقاط بنجاح وفتح الدورة التدريبية في حسابك.',
              );
              await loadData(true);
            } catch (err) {
              setErrorMsg(extractErrorMessage(err));
            } finally {
              setRedeemingId(null);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" />

      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>متجر المكافآت والدورات</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <ErrorBanner message={errorMsg} />

        {/* Current Score Balance Banner */}
        <View style={styles.balanceBanner}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>رصيد نقاطك المتاح للاستبدال</Text>
            <Text style={styles.balanceValue}>{stats.volunteerScore} نقطة ⭐</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <MarketplaceRewardsSection
            tutorials={tutorials}
            currentScore={stats.volunteerScore}
            onRedeem={handleRedeem}
            redeemingId={redeemingId}
          />
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
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
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  navSpacer: {
    width: 68,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 36,
  },
  balanceBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  balanceInfo: {
    alignItems: 'center',
    gap: 4,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  loaderBox: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});