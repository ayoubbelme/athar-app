import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { RecommendedProject } from '../../types/volunteer-home.types';
import { translateCategory } from '../../utils/arabic.util';
import { MatchDonutChart } from '../common/MatchDonutChart';
import { AppVectorIcon } from '../common/AppVectorIcon';

interface BestSkillChanceCardProps {
  item: RecommendedProject | null;
  onApply: (projectId: string) => void;
  onPressDetails: (item: RecommendedProject) => void;
  applyingId: string | null;
}

export const BestSkillChanceCard: React.FC<BestSkillChanceCardProps> = ({
  item,
  onApply,
  onPressDetails,
  applyingId,
}) => {
  if (!item) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>أفضل فرصة تناسب مهاراتك</Text>
        </View>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <AppVectorIcon name="target" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>لا توجد فرص مطابقة متاحة حالياً</Text>
          <Text style={styles.emptySub}>
            لقد قمت بالتقديم على جميع المشاريع المتاحة أو سيتم نشر فرص تطوعية
            جديدة قريباً.
          </Text>
        </View>
      </View>
    );
  }

  const { project, match } = item;
  const isApplying = applyingId === project.id;
  const matchedSkills = Array.isArray(match?.matchedSkills)
    ? match.matchedSkills
    : [];

  const orgName = project.organization?.name ?? 'جمعية معتمدة';
  const orgInitial = orgName.trim().charAt(0).toUpperCase() || 'ج';

  const accepted = project.acceptedVolunteers ?? 0;
  const max = project.maxVolunteers;
  const capacityRatio =
    max && max > 0 ? Math.min(1, Math.max(0, accepted / max)) : null;

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.titleWithAccent}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>أفضل فرصة تناسب مهاراتك</Text>
        </View>

        <View style={styles.topBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.topBadgeText}>الأعلى توافقاً</Text>
        </View>
      </View>

      {/* Main Featured Hero Card */}
      <View style={styles.heroCard}>
        {/* Subtle Decorative Background Glow */}
        <View style={styles.ambientGlow} />

        {/* Top Row: Organization Identity + Category on Right, Match Donut Chart on Left */}
        <View style={styles.topRow}>
          <View style={styles.rightCol}>
            {/* Organization Pill + Category Tag */}
            <View style={styles.orgAndCategoryRow}>
              <View style={styles.orgBadge}>
                <View style={styles.orgAvatarMini}>
                  <Text style={styles.orgAvatarMiniText}>{orgInitial}</Text>
                </View>
                <Text style={styles.orgName} numberOfLines={1}>
                  {orgName}
                </Text>
              </View>

              {project.category && (
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryTag}>
                    {translateCategory(project.category)}
                  </Text>
                </View>
              )}
            </View>

            {/* Project Title */}
            <Text style={styles.projectTitle} numberOfLines={2}>
              {project.title}
            </Text>
          </View>

          {/* Clean Match Donut Chart */}
          <View style={styles.donutWrapper}>
            <MatchDonutChart
              score={match?.score ?? 0}
              size={60}
              strokeWidth={5}
              label="توافق"
            />
          </View>
        </View>

        {/* Description Box */}
        <Text style={styles.shortDescription} numberOfLines={2}>
          {project.description}
        </Text>

        {/* Info & Matched Skills Chips */}
        <View style={styles.metaAndSkillsRow}>
          <View style={styles.metaChip}>
            <AppVectorIcon name="location" size={13} color={COLORS.primary} />
            <Text style={styles.metaChipText}>
              {project.location ? project.location : 'عن بُعد / مرن'}
            </Text>
          </View>

          {matchedSkills.slice(0, 3).map((s) => (
            <View key={s.skillId} style={styles.skillPill}>
              <AppVectorIcon name="check" size={11} color={COLORS.primary} />
              <Text style={styles.skillPillText}>{s.name}</Text>
            </View>
          ))}
        </View>

        {/* Volunteer Seats Progress Bar (if maxVolunteers is set) */}
        {capacityRatio !== null && (
          <View style={styles.capacityBox}>
            <View style={styles.capacityHeaderRow}>
              <View style={styles.capacityLabelRow}>
                <AppVectorIcon
                  name="users"
                  size={13}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.capacityLabel}>المقاعد المحجوزة</Text>
              </View>
              <Text style={styles.capacityCountText}>
                {accepted} من {max} متطوع
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(8, Math.round(capacityRatio * 100))}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* Dual Action Footer: Primary Apply + Secondary Details */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.applyBtn, isApplying && styles.applyBtnDisabled]}
            onPress={() => onApply(project.id)}
            disabled={isApplying}
            activeOpacity={0.85}
          >
            {isApplying ? (
              <ActivityIndicator color={COLORS.background} size="small" />
            ) : (
              <View style={styles.btnInnerRow}>
                <Text style={styles.applyBtnText}>تقديم سريع الآن</Text>
                <AppVectorIcon
                  name="arrow-left"
                  size={14}
                  color={COLORS.background}
                />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => onPressDetails(item)}
            activeOpacity={0.85}
          >
            <Text style={styles.detailsBtnText}>التفاصيل</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWithAccent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  topBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 186, 102, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
  },
  topBadgeText: {
    color: COLORS.primary,
    fontSize: 11.5,
    fontWeight: '800',
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 12,
  },
  ambientGlow: {
    position: 'absolute',
    top: -45,
    left: -45,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 186, 102, 0.08)',
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  rightCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  orgAndCategoryRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  orgBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    paddingRight: 5,
    paddingLeft: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orgAvatarMini: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgAvatarMiniText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.background,
  },
  orgName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    maxWidth: 145,
  },
  categoryPill: {
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  projectTitle: {
    fontSize: 18.5,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 25,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  donutWrapper: {
    paddingTop: 2,
  },
  shortDescription: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaAndSkillsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 7,
  },
  metaChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaChipText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '700',
    writingDirection: 'rtl',
  },
  skillPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 186, 102, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  skillPillText: {
    color: COLORS.primary,
    fontSize: 11.5,
    fontWeight: '800',
  },
  capacityBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  capacityHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityLabelRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  capacityLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  capacityCountText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginTop: 2,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyBtn: {
    flex: 1.5,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    opacity: 0.65,
  },
  btnInnerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  applyBtnText: {
    color: COLORS.background,
    fontSize: 14.5,
    fontWeight: '900',
  },
  detailsBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: COLORS.text,
    fontSize: 13.5,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});