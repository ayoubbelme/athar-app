// src/containers/profile/UserStatsReportContainer.tsx
import React, { useCallback, useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { profileApi } from '../../api/profile.api';
import { extractErrorMessage } from '../../utils/error.util';
import { UserProfileStats } from '../../types/profile.types';
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { UserStatsReportSection } from '../../components/profile/UserStatsReportSection';

export const UserStatsReportContainer: React.FC = () => {
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
        <Text style={styles.navTitle}>تقرير وإحصائيات المتطوع</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadStats(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <ErrorBanner message={errorMsg} />

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.stack}>
            {/* Rank & Total Impact Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.rankBadge}>{stats.rankTitle}</Text>
              <Text style={styles.scoreTitle}>
                إجمالي نقاط الأثر: {stats.volunteerScore} نقطة ⭐
              </Text>
              <Text style={styles.summaryDesc}>
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
  loaderBox: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: {
    gap: 22,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'flex-end',
    gap: 8,
  },
  rankBadge: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'right',
  },
  summaryDesc: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});