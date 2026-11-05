import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../api/profile.api';
import { extractErrorMessage } from '../../utils/error.util';
import { UserProfileStats } from '../../types/profile.types';
import { useTheme } from '../../context/ThemeContext';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { ProfileHeaderCard } from '../../components/profile/ProfileHeaderCard';
import { UserSkillsSection } from '../../components/profile/UserSkillsSection';
import { ProfileActionCards } from '../../components/profile/ProfileActionCards';
import { ProfileScreenSkeleton } from '../../components/common/AppSkeleton';

export const ProfileContainer: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<UserProfileStats>({
    volunteerScore: 150,
    hoursCount: 0,
    projectsCompletedCount: 0,
    rankTitle: 'متطوع مبادر 🌱',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadProfileData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
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

  // Re-fetch real stats every time the Profile screen is focused
  useFocusEffect(
    useCallback(() => {
      loadProfileData(false);
    }, [loadProfileData]),
  );

  if (!user) return null;

  const userSkills =
    (user as any).skills?.map((s: any) => ({
      id: s?.skill?.id ?? s?.id ?? String(Math.random()),
      name: s?.skill?.name ?? s?.name ?? 'مهارة',
    })) ?? [
      { id: '1', name: 'التعليم والتدريس' },
      { id: '2', name: 'تنظيم الفعاليات' },
      { id: '3', name: 'البرمجة وتطوير الويب' },
    ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 36,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProfileData(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <ErrorBanner message={errorMsg} />

       {loading ? (
  <ProfileScreenSkeleton />
) : (
          <View style={{ gap: 24 }}>
            {/* 1. Header Profile & Score Card */}
            <ProfileHeaderCard
              userName={user.name ?? 'متطوع'}
              userEmail={user.email ?? ''}
              stats={stats}
              onSignOut={signOut}
            />

            {/* 2. User Skills Section */}
            <UserSkillsSection skills={userSkills} />

            {/* 3. Navigation Buttons to Marketplace & Stats Report Screens */}
            <ProfileActionCards
              onPressMarketplace={() =>
                navigation.navigate('MarketplaceRewards')
              }
              onPressStatsReport={() =>
                navigation.navigate('UserStatsReport')
              }
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
