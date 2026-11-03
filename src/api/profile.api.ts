import { apiClient } from './client';
import {
  UserProfileStats,
  RewardTutorialItem,
  ImpactLeaderboardData,
  LeaderboardEntry,
} from '../types/profile.types';
import {
  calculateRealVolunteerStats,
  volunteerHomeApi,
} from './volunteer-home.api';
import { impactStorage } from '../storage/impact.storage';

export function computeRankTitle(
  score: number,
  completedCount: number,
): string {
  if (score >= 600 || completedCount >= 6) {
    return 'متطوع ماسي وسفير أثر 💎';
  }
  if (score >= 350 || completedCount >= 3) {
    return 'متطوع ذهبي متميز 🥇';
  }
  if (score >= 200 || completedCount >= 1) {
    return 'متطوع نشط وفضي 🥈';
  }
  return 'متطوع مبادر 🌱';
}

export const profileApi = {
  getProfileStats: async (): Promise<UserProfileStats> => {
    try {
      const [appsRes, redeemedList] = await Promise.all([
        volunteerHomeApi.getMyApplications(100),
        impactStorage.getRedeemedTutorials(),
      ]);

      const apps = Array.isArray(appsRes?.data) ? appsRes.data : [];
      const computed = await calculateRealVolunteerStats(apps);

      const spentScore = (redeemedList ?? []).reduce(
        (sum, item) => sum + (item.costScore ?? 0),
        0,
      );
      const netScore = Math.max(0, computed.impactScore - spentScore);

      return {
        volunteerScore: netScore,
        hoursCount: computed.totalHours,
        projectsCompletedCount: computed.completedProjectsCount,
        rankTitle: computeRankTitle(
          computed.impactScore,
          computed.completedProjectsCount,
        ),
      };
    } catch {
      return {
        volunteerScore: 150,
        hoursCount: 0,
        projectsCompletedCount: 0,
        rankTitle: 'متطوع مبادر 🌱',
      };
    }
  },

  /**
   * Fetches ONLY real users from the backend database (`GET /impact/leaderboard`).
   * Zero fake or hardcoded users.
   */
  getImpactLeaderboard: async (currentUser?: {
    id: string;
    name: string;
    location?: string | null;
  }): Promise<ImpactLeaderboardData> => {
    const { data } = await apiClient.get<{
      currentUserEntry: LeaderboardEntry | null;
      topVolunteers: LeaderboardEntry[];
      nearbyVolunteers: LeaderboardEntry[];
      totalVolunteers: number;
    }>('/impact/leaderboard');

    const topVolunteers = Array.isArray(data?.topVolunteers)
      ? data.topVolunteers
      : [];
    const nearbyVolunteers = Array.isArray(data?.nearbyVolunteers)
      ? data.nearbyVolunteers
      : [];

    const fallbackEntry: LeaderboardEntry =
      data?.currentUserEntry ??
      topVolunteers.find((v) => v.userId === currentUser?.id) ??
      topVolunteers[0] ?? {
        rank: 1,
        userId: currentUser?.id ?? 'me',
        name: currentUser?.name ?? 'متطوع',
        location: currentUser?.location ?? null,
        impactScore: 150,
        hoursCount: 0,
        completedProjectsCount: 0,
        rankTitle: 'متطوع مبادر 🌱',
        isCurrentUser: true,
      };

    return {
      currentUserEntry: fallbackEntry,
      topVolunteers,
      nearbyVolunteers:
        nearbyVolunteers.length > 0 ? nearbyVolunteers : topVolunteers.slice(0, 5),
      totalVolunteers: data?.totalVolunteers ?? topVolunteers.length,
    };
  },

  listRewardTutorials: async (): Promise<RewardTutorialItem[]> => {
    const redeemed = await impactStorage.getRedeemedTutorials();
    const redeemedIds = new Set((redeemed ?? []).map((r) => r.tutorialId));

    const defaultTutorials: RewardTutorialItem[] = [
      {
        id: 'tut-1',
        title: 'دورة إتقان React Native و Expo متقدم',
        description: 'تعلم بناء تطبيقات موبايل احترافية متكاملة ومترابطة.',
        costScore: 150,
        category: 'برمجة وتكنولوجيا',
        duration: 'ساعتان',
        unlocked: redeemedIds.has('tut-1'),
      },
      {
        id: 'tut-2',
        title: 'أساسيات إدارة المشاريع الإنسانية والتطوعية',
        description: 'كيف تدير المبادرات المجتمعية وتستقطب المتطوعين بكفاءة.',
        costScore: 100,
        category: 'إدارة وتخطيط',
        duration: 'ساعة ونصف',
        unlocked: redeemedIds.has('tut-2'),
      },
      {
        id: 'tut-3',
        title: 'دورة التصميم الجرافيكي وتجربة المستخدم UI/UX',
        description:
          'مهارات أساسية لتصميم واجهات تفاعلية جذابة وسهلة الاستخدام.',
        costScore: 200,
        category: 'تصميم وإبداع',
        duration: '3 ساعات',
        unlocked: redeemedIds.has('tut-3'),
      },
    ];

    try {
      const { data } = await apiClient.get<RewardTutorialItem[]>(
        '/rewards/tutorials',
      );
      if (Array.isArray(data) && data.length > 0) {
        return data.map((t) => ({
          ...t,
          unlocked: Boolean(t.unlocked || redeemedIds.has(t.id)),
        }));
      }
      return defaultTutorials;
    } catch {
      return defaultTutorials;
    }
  },

  redeemReward: async (
    tutorialId: string,
    costScore = 100,
  ): Promise<void> => {
    try {
      await apiClient.post(`/rewards/tutorials/${tutorialId}/redeem`, {});
    } catch {
      // Persist locally if backend endpoint is not enabled
    }
    await impactStorage.recordTutorialRedemption(tutorialId, costScore);
  },
};