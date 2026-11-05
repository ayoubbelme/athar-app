import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { User } from '../../types/auth.types';

interface UserProfileCardProps {
  user: User;
  onSignOut: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onSignOut,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.badge, { backgroundColor: colors.surfaceLight, color: colors.primary }]}>{user.role}</Text>
      <Text style={[styles.welcomeTitle, { color: colors.text }]}>Marhaba, {user.name}</Text>
      <Text style={[styles.metaText, { color: colors.textSecondary }]}>{user.email}</Text>
      {user.location && <Text style={[styles.metaText, { color: colors.textSecondary }]}>📍 {user.location}</Text>}

      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.errorBg, borderColor: colors.error }]} onPress={onSignOut}>
        <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  metaText: {
    fontSize: 14,
  },
  logoutBtn: {
    marginTop: 20,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  logoutText: {
    fontWeight: '700',
  },
});
