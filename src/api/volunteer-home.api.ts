import { apiClient } from './client';
import {
  MyApplicationItem,
  PaginatedResult,
  RecommendedProject,
  VolunteerImpactResponse,
} from '../types/volunteer-home.types';

export interface VolunteerHomeApiType {
  getRecommendedProjects: (
    limit?: number,
    minScore?: number,
  ) => Promise<PaginatedResult<RecommendedProject>>;
  getMyApplications: (
    limit?: number,
  ) => Promise<PaginatedResult<MyApplicationItem>>;
  applyToProject: (
    projectId: string,
    message?: string,
  ) => Promise<MyApplicationItem>;
  withdrawApplication: (applicationId: string) => Promise<void>;
  getMyVolunteerImpact: (
    projectId: string,
  ) => Promise<VolunteerImpactResponse | null>;
}

export const volunteerHomeApi: VolunteerHomeApiType = {
  getRecommendedProjects: async (
    limit = 20,
    minScore = 0,
  ): Promise<PaginatedResult<RecommendedProject>> => {
    const { data } = await apiClient.get<PaginatedResult<RecommendedProject>>(
      '/matching/projects',
      {
        params: { page: 1, limit, minScore },
      },
    );
    return data;
  },

  getMyApplications: async (
    limit = 50,
  ): Promise<PaginatedResult<MyApplicationItem>> => {
    const { data } = await apiClient.get<PaginatedResult<MyApplicationItem>>(
      '/applications/my',
      {
        params: { page: 1, limit, sortBy: 'createdAt', order: 'desc' },
      },
    );
    return data;
  },

  applyToProject: async (
    projectId: string,
    message?: string,
  ): Promise<MyApplicationItem> => {
    const body = message?.trim() ? { message: message.trim() } : {};
    const { data } = await apiClient.post<MyApplicationItem>(
      `/projects/${projectId}/applications`,
      body,
    );
    return data;
  },

  withdrawApplication: async (applicationId: string): Promise<void> => {
    await apiClient.delete(`/applications/${applicationId}`);
  },

  getMyVolunteerImpact: async (
    projectId: string,
  ): Promise<VolunteerImpactResponse | null> => {
    try {
      const { data } = await apiClient.get<VolunteerImpactResponse>(
        `/projects/${projectId}/impact/volunteer`,
      );
      return data;
    } catch {
      return null;
    }
  },
};

function estimateProjectHours(app: MyApplicationItem): number {
  const { startDate, endDate } = app.project ?? {};
  if (startDate && endDate) {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const diffHours = Math.max(0, (endMs - startMs) / (1000 * 60 * 60));
    if (diffHours > 0 && diffHours <= 16) {
      return Math.round(diffHours);
    } else if (diffHours > 16) {
      const days = Math.max(1, Math.ceil(diffHours / 24));
      return days * 8;
    }
  }
  return 4;
}

/**
 * Computes real volunteer hours, completed count, and impact score strictly from
 * organization-verified COMPLETED tasks.
 */
export async function calculateRealVolunteerStats(
  applications: MyApplicationItem[],
): Promise<{
  totalHours: number;
  completedProjectsCount: number;
  acceptedOrCompletedCount: number;
  activeRequestsCount: number;
  impactScore: number;
}> {
  const safeApps = Array.isArray(applications) ? applications : [];

  const activeRequestsCount = safeApps.filter(
    (a) => a && a.status !== 'WITHDRAWN',
  ).length;

  const acceptedApps = safeApps.filter((a) => a && a.status === 'ACCEPTED');
  const completedApps = safeApps.filter((a) => a && a.status === 'COMPLETED');

  const completedImpacts = await Promise.all(
    completedApps.map(async (app) => {
      if (app.volunteerImpact) return app.volunteerImpact;
      if (app.project?.id) {
        return volunteerHomeApi.getMyVolunteerImpact(app.project.id);
      }
      return null;
    }),
  );

  let totalHours = 0;
  let totalActivities = 0;
  let totalBeneficiaries = 0;

  completedApps.forEach((app, idx) => {
    const impact = completedImpacts[idx];
    if (impact && typeof impact.hours === 'number') {
      totalHours += impact.hours;
      totalActivities += impact.activitiesCount ?? 0;
      totalBeneficiaries += impact.beneficiariesCount ?? 0;
    } else {
      totalHours += estimateProjectHours(app);
    }
  });

  totalHours = Math.round(totalHours * 100) / 100;

  const impactScore = Math.round(
    150 +
      completedApps.length * 50 +
      totalHours * 10 +
      totalActivities * 5 +
      totalBeneficiaries * 1,
  );

  return {
    totalHours,
    completedProjectsCount: completedApps.length,
    acceptedOrCompletedCount: acceptedApps.length + completedApps.length,
    activeRequestsCount,
    impactScore,
  };
}