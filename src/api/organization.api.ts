import { apiClient } from './client';
import {
  ApplicationStatus,
  PaginatedResult,
  ProjectItem,
  ProjectStatus,
  VolunteerImpactPayload,
} from '../types/volunteer-home.types';
import {
  CreateProjectPayload,
  OrganizationApplicationItem,
} from '../types/organization.types';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const organizationApi = {
  getMyProjects: async (limit = 50): Promise<ProjectItem[]> => {
    try {
      const { data } = await apiClient.get<
        PaginatedResult<ProjectItem> | ProjectItem[]
      >('/projects/my', {
        params: { page: 1, limit },
      });
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
    } catch {
      // Fallback to /projects if /projects/my is not separate
    }

    const { data } = await apiClient.get<
      PaginatedResult<ProjectItem> | ProjectItem[]
    >('/projects', {
      params: { page: 1, limit },
    });
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.data) ? data.data : [];
  },

  createProject: async (
    payload: CreateProjectPayload,
  ): Promise<ProjectItem> => {
    // Build a clean DTO matching the backend's strict CreateProjectDto whitelist
    const cleanBody: Record<string, unknown> = {
      title: payload.title.trim(),
      description: payload.description.trim(),
    };

    if (payload.category) {
      cleanBody.category = payload.category;
    }
    if (payload.location && payload.location.trim()) {
      cleanBody.location = payload.location.trim();
    }
    if (
      typeof payload.maxVolunteers === 'number' &&
      payload.maxVolunteers >= 1
    ) {
      cleanBody.maxVolunteers = payload.maxVolunteers;
    }
    if (payload.startDate && payload.startDate.trim()) {
      cleanBody.startDate = payload.startDate.trim();
    }
    if (payload.endDate && payload.endDate.trim()) {
      cleanBody.endDate = payload.endDate.trim();
    }
    if (Array.isArray(payload.availability) && payload.availability.length > 0) {
      cleanBody.availability = payload.availability;
    }
    if (payload.status === 'PUBLISHED' || payload.status === 'DRAFT') {
      cleanBody.status = payload.status;
    }

    // Only include skills that have a valid UUID skillId (custom skills are appended to description or ignored by UUID validator)
    if (Array.isArray(payload.skills) && payload.skills.length > 0) {
      const validUuidSkills = payload.skills.filter((s) =>
        UUID_REGEX.test(s.skillId),
      );
      if (validUuidSkills.length > 0) {
        cleanBody.skills = validUuidSkills;
      }
    }

    const { data } = await apiClient.post<ProjectItem>('/projects', cleanBody);
    return data;
  },

  updateProjectStatus: async (
    projectId: string,
    status: ProjectStatus,
  ): Promise<ProjectItem> => {
    const { data } = await apiClient.patch<ProjectItem>(
      `/projects/${projectId}`,
      { status },
    );
    return data;
  },

  getProjectApplications: async (
    projectId: string,
    projectMeta?: {
      title: string;
      status: ProjectStatus;
      location: string | null;
    },
  ): Promise<OrganizationApplicationItem[]> => {
    const { data } = await apiClient.get<
      PaginatedResult<OrganizationApplicationItem> | OrganizationApplicationItem[]
    >(`/projects/${projectId}/applications`, {
      params: { page: 1, limit: 100 },
    });

    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    return rawList.map((item) => ({
      ...item,
      project: item.project ?? {
        id: projectId,
        title: projectMeta?.title ?? 'مشروع تطوعي',
        status: projectMeta?.status ?? 'PUBLISHED',
        location: projectMeta?.location ?? null,
      },
    }));
  },

  getAllIncomingRequests: async (): Promise<OrganizationApplicationItem[]> => {
    try {
      const { data } = await apiClient.get<
        PaginatedResult<OrganizationApplicationItem> | OrganizationApplicationItem[]
      >('/applications/organization', {
        params: { page: 1, limit: 100 },
      });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : null;
      if (list) return list;
    } catch {
      // Aggregate from organization projects if /applications/organization is not exposed
    }

    const myProjects = await organizationApi.getMyProjects(50);
    const results = await Promise.all(
      myProjects.map((proj) =>
        organizationApi
          .getProjectApplications(proj.id, {
            title: proj.title,
            status: proj.status,
            location: proj.location,
          })
          .catch(() => [] as OrganizationApplicationItem[]),
      ),
    );

    const merged = results.flat();
    return merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  updateApplicationStatus: async (
    applicationId: string,
    status: Extract<ApplicationStatus, 'ACCEPTED' | 'COMPLETED' | 'REJECTED'>,
    impactPayload?: VolunteerImpactPayload,
  ): Promise<OrganizationApplicationItem> => {
    const { data } = await apiClient.patch<OrganizationApplicationItem>(
      `/applications/${applicationId}/status`,
      {
        status,
        ...(status === 'COMPLETED' && impactPayload ? impactPayload : {}),
      },
    );
    return data;
  },
};