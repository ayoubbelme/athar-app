import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  calculateRealVolunteerStats,
  volunteerHomeApi,
} from '../../api/volunteer-home.api';
import { extractErrorMessage } from '../../utils/error.util';
import {
  RecommendedProject,
  VolunteerStatsSummary,
} from '../../types/volunteer-home.types';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { HomeTopHeader } from '../../components/home/HomeTopHeader';
import { BestSkillChanceCard } from '../../components/home/BestSkillChanceCard';
import { VolunteerStatsRow } from '../../components/home/VolunteerStatsRow';
import { SkillMatchedChancesSection } from '../../components/home/SkillMatchedChancesSection';
import { UserProfileCard } from '../../components/home/UserProfileCard';

export const HomeContainer: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
  const { colors } = useTheme();

  const [recommendations, setRecommendations] = useState<RecommendedProject[]>(
    [],
  );
  const [stats, setStats] = useState<VolunteerStatsSummary>({
    hoursOfVolunteering: 0,
    requestsCount: 0,
    projectsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDashboardData = useCallback(
    async (isRefresh = false) => {
      if (!user || user.role !== 'VOLUNTEER') {
        setLoading(false);
        return;
      }

      if (isRefresh) setRefreshing(true);
      setErrorMsg(null);

      try {
        const [recRes, appRes] = await Promise.all([
          volunteerHomeApi.getRecommendedProjects(20, 0),
          volunteerHomeApi.getMyApplications(100),
        ]);

        const recList = Array.isArray(recRes?.data) ? recRes.data : [];
        const applications = Array.isArray(appRes?.data) ? appRes.data : [];

        setRecommendations(recList);

        const computed = await calculateRealVolunteerStats(applications);

        setStats({
          hoursOfVolunteering: computed.totalHours,
          requestsCount: computed.activeRequestsCount,
          projectsCount: computed.acceptedOrCompletedCount,
        });
      } catch (err) {
        setErrorMsg(extractErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  // Automatically refresh dashboard stats every time the Home tab gains focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData(false);
    }, [loadDashboardData]),
  );

  const handleApply = async (projectId: string) => {
    setApplyingId(projectId);
    setErrorMsg(null);
    try {
      await volunteerHomeApi.applyToProject(projectId);
      Alert.alert(
        'تم إرسال طلبك بنجاح!',
        'تم إرسال طلب التطوع الخاص بك إلى الجمعية للمراجعة.',
      );
      await loadDashboardData(true);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setApplyingId(null);
    }
  };

  const handleOpenDetails = (recItem: RecommendedProject) => {
    navigation.navigate('ChanceDetails', {
      project: recItem.project,
      match: recItem.match,
      matchScore: recItem.match?.score ?? null,
    });
  };

  if (!user) return null;

  if (user.role !== 'VOLUNTEER') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.orgFallback}>
          <UserProfileCard user={user} onSignOut={signOut} />
        </View>
      </SafeAreaView>
    );
  }

  const firstName = (user.name ?? 'متطوع').split(' ')[0];
  const bestChance: RecommendedProject | null =
    recommendations.length > 0 ? recommendations[0] : null;
  const otherChances: RecommendedProject[] =
    recommendations.length > 1 ? recommendations.slice(1) : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadDashboardData(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <HomeTopHeader
          userName={user.name ?? 'متطوع'}
          title={`مرحباً بك، ${firstName} 👋`}
          subtitle="اكتشف الفرص التطوعية التي تناسب مهاراتك واصنع أثراً حقيقياً في مجتمعك."
          onSignOut={signOut}
        />

        <ErrorBanner message={errorMsg} />

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <BestSkillChanceCard
              item={bestChance}
              onApply={handleApply}
              onPressDetails={handleOpenDetails}
              applyingId={applyingId}
            />

            <VolunteerStatsRow stats={stats} />

            <SkillMatchedChancesSection
              items={otherChances}
              onApply={handleApply}
              onPressDetails={handleOpenDetails}
              applyingId={applyingId}
              onPressExploreAll={() => navigation.navigate('ChancesTab')}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
  loaderBox: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgFallback: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});
