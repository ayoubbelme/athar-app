import React from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ScreenLayout } from '../../components/common/ScreenLayout';
import { UserProfileCard } from '../../components/home/UserProfileCard';

export const HomeContainer: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <ScreenLayout scrollable={false} contentStyle={styles.centered}>
      <UserProfileCard user={user} onSignOut={signOut} />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  centered: { justifyContent: 'center' },
});