// src/screens/ProfileScreen.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileContainer } from '../containers/profile/ProfileContainer';
import { OrgProfileContainer } from '../containers/organization/OrgProfileContainer';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'ORGANIZATION') {
    return <OrgProfileContainer />;
  }
  return <ProfileContainer />;
};