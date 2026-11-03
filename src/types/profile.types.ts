export interface UserSkillItem {
  id: string;
  name: string;
  level?: string;
}

export interface UserProfileStats {
  volunteerScore: number;
  hoursCount: number;
  projectsCompletedCount: number;
  rankTitle: string;
}

export interface RewardTutorialItem {
  id: string;
  title: string;
  description: string;
  costScore: number;
  category: string;
  duration: string;
  unlocked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  location: string | null;
  impactScore: number;
  hoursCount: number;
  completedProjectsCount: number;
  rankTitle: string;
  isCurrentUser: boolean;
}

export interface ImpactLeaderboardData {
  currentUserEntry: LeaderboardEntry;
  topVolunteers: LeaderboardEntry[];
  nearbyVolunteers: LeaderboardEntry[];
  totalVolunteers: number;
}