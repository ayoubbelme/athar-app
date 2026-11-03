import { SelfRegistrationRole } from '../types/auth.types';
import {
  MatchResult,
  ProjectCategory,
  ProjectItem,
} from '../types/volunteer-home.types';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: { initialRole?: SelfRegistrationRole } | undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ChancesTab: { initialCategory?: ProjectCategory } | undefined;
  RequestsTab: undefined;
  ProfileTab: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  ChanceDetails: {
    project: ProjectItem;
    match?: MatchResult | null;
    matchScore?: number | null;
    alreadyApplied?: boolean;
  };
  UserStatsReport: undefined;
  MarketplaceRewards: undefined;
  ImpactLeaderboard: undefined;
};