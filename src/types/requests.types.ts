import {
  ApplicationStatus,
  ProjectStatus,
  VolunteerImpactSummary,
} from './volunteer-home.types';

export interface ApplicationProjectView {
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
}

export interface VolunteerApplicationItem {
  id: string;
  status: ApplicationStatus;
  matchScore: number | null;
  message: string | null;
  completedAt?: string | null;
  volunteerImpact?: VolunteerImpactSummary | null;
  project: ApplicationProjectView;
  createdAt: string;
  updatedAt: string;
}