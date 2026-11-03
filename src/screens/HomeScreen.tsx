// src/screens/HomeScreen.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HomeContainer } from '../containers/home/HomeContainer';
import { OrgHomeContainer } from '../containers/organization/OrgHomeContainer';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'ORGANIZATION') {
    return <OrgHomeContainer />;
  }
  return <HomeContainer />;
};