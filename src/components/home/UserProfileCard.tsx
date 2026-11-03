import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { User } from '../../types/auth.types';

interface UserProfileCardProps {
  user: User;
  onSignOut: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onSignOut,
}) => (
  <View style={styles.card}>
    <Text style={styles.badge}>{user.role}</Text>
    <Text style={styles.welcomeTitle}>Marhaba, {user.name}</Text>
    <Text style={styles.metaText}>{user.email}</Text>
    {user.location && <Text style={styles.metaText}>📍 {user.location}</Text>}

    <TouchableOpacity style={styles.logoutBtn} onPress={onSignOut}>
      <Text style={styles.logoutText}>Sign Out</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.surfaceLight,
    color: COLORS.primary,
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
    color: COLORS.text,
    marginTop: 8,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: '700',
  },
});