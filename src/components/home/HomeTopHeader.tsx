import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { AppVectorIcon } from '../common/AppVectorIcon';

interface HomeTopHeaderProps {
  userName: string;
  title: string;
  subtitle: string;
  onSignOut?: () => void;
}

export const HomeTopHeader: React.FC<HomeTopHeaderProps> = ({
  userName,
  title,
  subtitle,
}) => {
  const initials = (userName || 'متطوع')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.heroBanner}>
      <View style={styles.glowCircleTopLeft} />
      <View style={styles.glowCircleBottomRight} />

      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarRing}>
            <Text style={styles.avatarText}>{initials || 'أ'}</Text>
          </View>
          <View style={styles.onlineStatusBadge} />
        </View>

        <View style={styles.greetingCol}>
          <View style={styles.welcomeTag}>
            <AppVectorIcon name="sparkle" size={12} color={COLORS.primary} />
            <Text style={styles.welcomeTagText}>معاً نصنع الأثر</Text>
          </View>
          <Text style={styles.title}>{title.replace(/👋/g, '').trim()}</Text>
        </View>
      </View>

      <View style={styles.subtitleBox}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.pillsRow}>
        <View style={styles.featurePill}>
          <AppVectorIcon name="target" size={13} color={COLORS.primary} />
          <Text style={styles.featurePillText}>مطابقة ذكية للمهارات</Text>
        </View>
        <View style={styles.featurePill}>
          <AppVectorIcon name="check" size={13} color={COLORS.primary} />
          <Text style={styles.featurePillText}>توثيق معتمد للساعات</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroBanner: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 14,
  },
  glowCircleTopLeft: {
    position: 'absolute',
    top: -35,
    left: -35,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0, 186, 102, 0.10)',
  },
  glowCircleBottomRight: {
    position: 'absolute',
    bottom: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 186, 102, 0.07)',
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  onlineStatusBadge: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderWidth: 2.5,
    borderColor: COLORS.surface,
  },
  greetingCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 5,
  },
  welcomeTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 186, 102, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 186, 102, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  welcomeTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitleBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  pillsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  featurePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  featurePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text,
  },
});