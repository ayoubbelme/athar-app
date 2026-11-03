import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { UserProfileStats } from '../../types/profile.types';
import { AppVectorIcon } from '../common/AppVectorIcon';

interface ProfileHeaderCardProps {
  userName: string;
  userEmail: string;
  stats: UserProfileStats;
  onSignOut: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  userName,
  userEmail,
  stats,
  onSignOut,
}) => {
  const cleanRank = stats.rankTitle.replace(/[💎🥇🥈🌱⭐]/g, '').trim();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}>
          <Text style={styles.signOutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
        <View style={styles.userInfoCol}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {userName ? userName.slice(0, 2).toUpperCase() : 'مت'}
          </Text>
        </View>
      </View>

      <View style={styles.scoreBanner}>
        <View style={styles.scoreCol}>
          <View style={styles.valueWithIconRow}>
            <AppVectorIcon name="star" size={16} color={COLORS.primary} />
            <Text style={styles.scoreNumber}>{stats.volunteerScore} نقطة</Text>
          </View>
          <Text style={styles.scoreLabel}>رصيد نقاط الأثر</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.rankCol}>
          <View style={styles.valueWithIconRow}>
            <AppVectorIcon name="trophy" size={15} color={COLORS.primary} />
            <Text style={styles.rankText}>{cleanRank}</Text>
          </View>
          <Text style={styles.scoreLabel}>المستوى الحالي</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userInfoCol: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  signOutBtn: {
    backgroundColor: 'rgba(255, 90, 95, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  signOutText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '700',
  },
  scoreBanner: {
    flexDirection: 'row-reverse',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  valueWithIconRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  rankCol: {
    flex: 1,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
});