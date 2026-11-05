// src/containers/profile/UserStatsReportContainer.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { UserProfileStats } from '../../types/profile.types';
import { useTheme } from '../../context/ThemeContext';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { UserStatsReportSection } from '../../components/profile/UserStatsReportSection';

export const UserStatsReportContainer: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [stats, setStats] = useState<UserProfileStats>({
    volunteerScore: 350,
    hoursCount: 24,
    projectsCompletedCount: 5,
    rankTitle: 'متطوع نشط وفضي 🥈',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const statsData = await profileApi.getProfileStats();
      setStats(statsData);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

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
          تقرير وإحصائيات المتطوع
        </Text>
        <View style={{ width: 68 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 36 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadStats(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <ErrorBanner message={errorMsg} />

        {loading ? (
          <View style={{ paddingVertical: 80, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={{ gap: 22 }}>
            {/* Rank & Total Impact Card */}
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1.5,
                borderColor: colors.primary,
                alignItems: 'flex-end',
                gap: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '800',
                  color: colors.primary,
                  backgroundColor: 'rgba(0, 186, 102, 0.14)',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 10,
                }}
              >
                {stats.rankTitle}
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: '900', color: colors.text, textAlign: 'right' }}
              >
                إجمالي نقاط الأثر: {stats.volunteerScore} نقطة ⭐
              </Text>
              <Text
                style={{
                  fontSize: 13.5,
                  color: colors.textSecondary,
                  lineHeight: 20,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                }}
              >
                يعكس هذا التقرير مساهماتك التطوعية الفعالة والتزامك بالمبادرات
                المجتمعية المسجلة على منصة أثر.
              </Text>
            </View>

            {/* Detailed Stats Grid */}
            <UserStatsReportSection stats={stats} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
