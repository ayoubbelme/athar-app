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
import { MatchDonutChart } from '../common/MatchDonutChart';
import { AppVectorIcon } from '../common/AppVectorIcon';

export interface SkillMatchedChancesSectionProps {
  items: RecommendedProject[];
  onApply: (projectId: string) => void;
  onPressDetails: (item: RecommendedProject) => void;
  applyingId: string | null;
  onPressExploreAll?: () => void;
}

export const SkillMatchedChancesSection: React.FC<
  SkillMatchedChancesSectionProps
> = ({ items, onApply, onPressDetails, applyingId, onPressExploreAll }) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>فرص تطابق مهاراتك</Text>
        {onPressExploreAll && (
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={onPressExploreAll}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllLink}>عرض كل الفرص</Text>
            <AppVectorIcon name="arrow-left" size={13} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {safeItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            لا توجد فرص إضافية مطابقة حالياً. يمكنك تصفح جميع الفرص المتاحة
            والبحث فيها مباشرة.
          </Text>
          {onPressExploreAll && (
            <TouchableOpacity
              style={styles.exploreAllBtn}
              onPress={onPressExploreAll}
            >
              <AppVectorIcon name="search" size={15} color={COLORS.primary} />
              <Text style={styles.exploreAllBtnText}>
                تصفح جميع الفرص التطوعية
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.list}>
          {safeItems.map((recItem) => {
            const { project, match } = recItem;
            const isApplying = applyingId === project.id;
            const matchedSkills = Array.isArray(match?.matchedSkills)
              ? match.matchedSkills
              : [];

            return (
              <View key={project.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleCol}>
                    <Text style={styles.orgName}>
                      {project.organization?.name ?? 'جمعية'}
                    </Text>
                    <Text style={styles.projectTitle} numberOfLines={2}>
                      {project.title}
                    </Text>
                  </View>

                  <MatchDonutChart
                    score={match?.score ?? 0}
                    size={54}
                    strokeWidth={5}
                    label="توافق"
                  />
                </View>

                <Text style={styles.description} numberOfLines={1}>
                  {project.description}
                </Text>

                <View style={styles.skillsRow}>
                  <View style={styles.locationChip}>
                    <AppVectorIcon
                      name="location"
                      size={12}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.locationChipText}>
                      {project.location ? project.location : 'عن بُعد'}
                    </Text>
                  </View>
                  {matchedSkills.slice(0, 2).map((s) => (
                    <View key={s.skillId} style={styles.matchedChip}>
                      <AppVectorIcon
                        name="check"
                        size={11}
                        color={COLORS.primary}
                      />
                      <Text style={styles.matchedChipText}>{s.name}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={[
                      styles.smallApplyBtn,
                      isApplying && styles.smallApplyBtnDisabled,
                    ]}
                    onPress={() => onApply(project.id)}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <ActivityIndicator
                        color={COLORS.background}
                        size="small"
                      />
                    ) : (
                      <Text style={styles.smallApplyText}>تقديم</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() => onPressDetails(recItem)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.detailsBtnText}>عرض التفاصيل</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {onPressExploreAll && (
            <TouchableOpacity
              style={styles.exploreAllBtn}
              onPress={onPressExploreAll}
              activeOpacity={0.85}
            >
              <AppVectorIcon name="search" size={16} color={COLORS.primary} />
              <Text style={styles.exploreAllBtnText}>
                استكشف وابحث في جميع الفرص التطوعية
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  viewAllBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  viewAllLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  titleCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  orgName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'right',
  },
  projectTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  skillsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  locationChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationChipText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  matchedChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchedChipText: {
    color: COLORS.primary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  smallApplyBtn: {
    flex: 1.2,
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallApplyBtnDisabled: {
    opacity: 0.6,
  },
  smallApplyText: {
    color: COLORS.background,
    fontSize: 13.5,
    fontWeight: '800',
  },
  detailsBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-end',
    gap: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  exploreAllBtn: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  exploreAllBtnText: {
    color: COLORS.primary,
    fontSize: 14.5,
    fontWeight: '800',
  },
});