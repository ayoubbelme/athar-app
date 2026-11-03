import {
  ProjectCategory,
  ProjectItem,
  ProjectStatus,
} from './volunteer-home.types';

export type ProjectSortField = 'createdAt' | 'startDate' | 'endDate' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface SkillOption {
  id: string;
  name: string;
  description: string | null;
}

export interface ChancesFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProjectCategory | null;
  location?: string;
  skillId?: string | null;
  status?: ProjectStatus | null;
  sortBy?: ProjectSortField;
  order?: SortOrder;
}

export interface ChanceCardViewModel {
  project: ProjectItem;
  matchScore: number | null;
  alreadyApplied: boolean;
}