import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
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
  const { colors } = useTheme();
  const cleanRank = stats.rankTitle.replace(/[💎🥇🥈🌱⭐]/g, '').trim();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <TouchableOpacity style={[styles.signOutBtn, { borderColor: colors.error }]} onPress={onSignOut}>
          <Text style={[styles.signOutText, { color: colors.error }]}>تسجيل الخروج</Text>
        </TouchableOpacity>
        <View style={styles.userInfoCol}>
          <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail}</Text>
        </View>
        <View style={[styles.avatarCircle, { backgroundColor: colors.surfaceLight, borderColor: colors.primary }]}>
          <Text style={[styles.avatarInitials, { color: colors.primary }]}>
            {userName ? userName.slice(0, 2).toUpperCase() : 'مت'}
          </Text>
        </View>
      </View>

      <View style={[styles.scoreBanner, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
        <View style={styles.scoreCol}>
          <View style={styles.valueWithIconRow}>
            <AppVectorIcon name="star" size={16} color={colors.primary} />
            <Text style={[styles.scoreNumber, { color: colors.primary }]}>{stats.volunteerScore} نقطة</Text>
          </View>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>رصيد نقاط الأثر</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.rankCol}>
          <View style={styles.valueWithIconRow}>
            <AppVectorIcon name="trophy" size={15} color={colors.primary} />
            <Text style={[styles.rankText, { color: colors.text }]}>{cleanRank}</Text>
          </View>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>المستوى الحالي</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
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
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '800',
  },
  userInfoCol: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 12.5,
    textAlign: 'right',
  },
  signOutBtn: {
    backgroundColor: 'rgba(255, 90, 95, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreBanner: {
    flexDirection: 'row-reverse',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
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
  },
  scoreLabel: {
    fontSize: 11.5,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
  },
  rankCol: {
    flex: 1,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14.5,
    fontWeight: '700',
    textAlign: 'center',
  },
});
