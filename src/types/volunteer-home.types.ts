import { Availability } from './auth.types';

export type ProjectStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProjectCategory =
  | 'EDUCATION'
  | 'HEALTH'
  | 'ENVIRONMENT'
  | 'COMMUNITY'
  | 'HUMANITARIAN'
  | 'ARTS_CULTURE'
  | 'SPORTS'
  | 'TECHNOLOGY'
  | 'ANIMAL_WELFARE';

export type ProficiencyLevel =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT';

export type ApplicationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ProjectOrganization {
  id: string;
  name: string;
  logo: string | null;
  location?: string | null;
}

export interface ProjectSkillRequirement {
  skill: {
    id: string;
    name: string;
  };
  requiredCount: number;
  importance: number;
}

export interface ProjectItem {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  status: ProjectStatus;
  maxVolunteers: number | null;
  category: ProjectCategory | null;
  availability: Availability[];
  acceptedVolunteers: number;
  organization: ProjectOrganization;
  skills: ProjectSkillRequirement[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchedSkill {
  skillId: string;
  name: string;
  importance: number;
  proficiency: ProficiencyLevel;
}

export interface MissingSkill {
  skillId: string;
  name: string;
  importance: number;
}

export interface ComponentBreakdown {
  weight: number;
  applicable: boolean;
  ratio: number | null;
  contribution: number;
}

export interface MatchResult {
  score: number;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  locationMatch: boolean | null;
  interestMatch: boolean | null;
  availabilityMatch: boolean | null;
  breakdown: {
    skills: ComponentBreakdown;
    location: ComponentBreakdown;
    interest: ComponentBreakdown;
    availability: ComponentBreakdown;
  };
  strategy: string;
}

export interface RecommendedProject {
  project: ProjectItem;
  match: MatchResult;
}

export interface VolunteerImpactSummary {
  hours: number;
  activitiesCount: number;
  beneficiariesCount: number;
  resources: string | null;
  description: string | null;
}

export interface MyApplicationItem {
  id: string;
  status: ApplicationStatus;
  matchScore: number | null;
  message: string | null;
  completedAt?: string | null;
  volunteerImpact?: VolunteerImpactSummary | null;
  project: {
    id: string;
    title: string;
    status: ProjectStatus;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    organization: {
      id: string;
      name: string;
      logo: string | null;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerImpactPayload {
  hours: number;
  activitiesCount?: number;
  beneficiariesCount?: number;
  resources?: string;
  description?: string;
}

export interface VolunteerImpactResponse extends VolunteerImpactSummary {
  id: string;
  applicationId: string;
  projectId: string;
  volunteerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerStatsSummary {
  hoursOfVolunteering: number;
  requestsCount: number;
  projectsCount: number;
}