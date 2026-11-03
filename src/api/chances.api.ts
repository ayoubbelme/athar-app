import { apiClient } from './client';
import {
  PaginatedResult,
  ProjectItem,
} from '../types/volunteer-home.types';
import {
  ChancesFilterParams,
  SkillOption,
} from '../types/chances.types';

export const chancesApi = {
  listProjects: async (
    filters: ChancesFilterParams,
  ): Promise<PaginatedResult<ProjectItem>> => {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 30,
      sortBy: filters.sortBy ?? 'createdAt',
      order: filters.order ?? 'desc',
    };

    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.location?.trim()) {
      params.location = filters.location.trim();
    }
    if (filters.skillId) {
      params.skillId = filters.skillId;
    }
    if (filters.status) {
      params.status = filters.status;
    }

    const { data } = await apiClient.get<PaginatedResult<ProjectItem>>(
      '/projects',
      { params },
    );
    return data;
  },

  listSkills: async (): Promise<SkillOption[]> => {
    const { data } = await apiClient.get<PaginatedResult<SkillOption>>(
      '/skills',
      { params: { page: 1, limit: 50, sortBy: 'name', order: 'asc' } },
    );
    return data.data;
  },
};