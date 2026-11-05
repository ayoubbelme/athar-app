import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { profileApi } from '../../api/profile.api';
import { extractErrorMessage } from '../../utils/error.util';
import { RewardTutorialItem, UserProfileStats } from '../../types/profile.types';
import { useTheme } from '../../context/ThemeContext';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { MarketplaceRewardsSection } from '../../components/profile/MarketplaceRewardsSection';

export const MarketplaceRewardsContainer: React.FC = () => {
  const { colors } = useTheme();
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
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" />

      {/* Top Navigation Bar */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.surfaceLight,
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={{ color: colors.text, fontSize: 13.5, fontWeight: '700' }}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16.5, fontWeight: '800', color: colors.text }}>
          متجر المكافآت والدورات
        </Text>
        <View style={{ width: 68 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 36 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <ErrorBanner message={errorMsg} />

        {/* Current Score Balance Banner */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 18,
            padding: 18,
            borderWidth: 1.5,
            borderColor: colors.primary,
            alignItems: 'center',
          }}
        >
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary }}>
              رصيد نقاطك المتاح للاستبدال
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '900', color: colors.primary }}>
              {stats.volunteerScore} نقطة ⭐
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 80, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
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
