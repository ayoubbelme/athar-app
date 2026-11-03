import { Availability } from './auth.types';
import {
  ApplicationStatus,
  ProficiencyLevel,
  ProjectCategory,
  ProjectStatus,
  VolunteerImpactSummary,
} from './volunteer-home.types';

export interface CreateProjectSkillPayload {
  skillId: string;
  requiredCount?: number;
  importance?: number;
}

export interface CreateProjectCustomSkillPayload {
  name: string;
  requiredCount?: number;
  importance?: number;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  category?: ProjectCategory | null;
  categories?: ProjectCategory[];
  customCategories?: string[];
  location?: string | null;
  maxVolunteers?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  availability?: Availability[];
  status?: ProjectStatus;
  skills?: CreateProjectSkillPayload[];
  customSkills?: CreateProjectCustomSkillPayload[];
}

export interface ApplicantUserSkill {
  skill: {
    id: string;
    name: string;
  };
  proficiency?: ProficiencyLevel;
}

export interface ApplicantVolunteerProfile {
  id: string;
  name: string;
  email: string;
  location: string | null;
  availability?: Availability[];
  skills?: ApplicantVolunteerSkillItem[];
}

export interface ApplicantVolunteerSkillItem {
  id?: string;
  skill?: {
    id: string;
    name: string;
  };
  name?: string;
  proficiency?: ProficiencyLevel;
}

export interface OrganizationApplicationItem {
  id: string;
  status: ApplicationStatus;
  matchScore: number | null;
  message: string | null;
  completedAt?: string | null;
  volunteerImpact?: VolunteerImpactSummary | null;
  volunteer?: ApplicantVolunteerProfile;
  user?: ApplicantVolunteerProfile;
  project: {
    id: string;
    title: string;
    status: ProjectStatus;
    category?: ProjectCategory | null;
    location: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationDashboardStats {
  totalChancesCount: number;
  openChancesCount: number;
  pendingRequestsCount: number;
  acceptedVolunteersCount: number;
}