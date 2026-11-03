// src/screens/RequestsScreen.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RequestsContainer } from '../containers/requests/RequestsContainer';
import { OrgRequestsContainer } from '../containers/organization/OrgRequestsContainer';

export const RequestsScreen: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'ORGANIZATION') {
    return <OrgRequestsContainer />;
  }
  return <RequestsContainer />;
};