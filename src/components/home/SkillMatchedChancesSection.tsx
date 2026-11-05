import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
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
  const { colors } = useTheme();
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>فرص تطابق مهاراتك</Text>
        {onPressExploreAll && (
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={onPressExploreAll}
            activeOpacity={0.8}
          >
            <Text style={[styles.viewAllLink, { color: colors.primary }]}>عرض كل الفرص</Text>
            <AppVectorIcon name="arrow-left" size={13} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {safeItems.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            لا توجد فرص إضافية مطابقة حالياً. يمكنك تصفح جميع الفرص المتاحة
            والبحث فيها مباشرة.
          </Text>
          {onPressExploreAll && (
            <TouchableOpacity
              style={[styles.exploreAllBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.primary }]}
              onPress={onPressExploreAll}
            >
              <AppVectorIcon name="search" size={15} color={colors.primary} />
              <Text style={[styles.exploreAllBtnText, { color: colors.primary }]}>
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
              <View key={project.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleCol}>
                    <Text style={[styles.orgName, { color: colors.primary }]}>
                      {project.organization?.name ?? 'جمعية'}
                    </Text>
                    <Text style={[styles.projectTitle, { color: colors.text }]} numberOfLines={2}>
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

                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
                  {project.description}
                </Text>

                <View style={styles.skillsRow}>
                  <View style={[styles.locationChip, { backgroundColor: colors.surfaceLight }]}>
                    <AppVectorIcon
                      name="location"
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text style={[styles.locationChipText, { color: colors.textSecondary }]}>
                      {project.location ? project.location : 'عن بُعد'}
                    </Text>
                  </View>
                  {matchedSkills.slice(0, 2).map((s) => (
                    <View key={s.skillId} style={styles.matchedChip}>
                      <AppVectorIcon
                        name="check"
                        size={11}
                        color={colors.primary}
                      />
                      <Text style={[styles.matchedChipText, { color: colors.primary }]}>{s.name}</Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <TouchableOpacity
                    style={[
                      styles.smallApplyBtn,
                      { backgroundColor: colors.primary },
                      isApplying && styles.smallApplyBtnDisabled,
                    ]}
                    onPress={() => onApply(project.id)}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <ActivityIndicator
                        color={colors.background}
                        size="small"
                      />
                    ) : (
                      <Text style={[styles.smallApplyText, { color: colors.background }]}>تقديم</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.detailsBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                    onPress={() => onPressDetails(recItem)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.detailsBtnText, { color: colors.text }]}>عرض التفاصيل</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {onPressExploreAll && (
            <TouchableOpacity
              style={[styles.exploreAllBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.primary }]}
              onPress={onPressExploreAll}
              activeOpacity={0.85}
            >
              <AppVectorIcon name="search" size={16} color={colors.primary} />
              <Text style={[styles.exploreAllBtnText, { color: colors.primary }]}>
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
  },
  list: {
    gap: 14,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    textAlign: 'right',
  },
  projectTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  description: {
    fontSize: 13,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationChipText: {
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
    fontSize: 11.5,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  smallApplyBtn: {
    flex: 1.2,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallApplyBtnDisabled: {
    opacity: 0.6,
  },
  smallApplyText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  detailsBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBox: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    alignItems: 'flex-end',
    gap: 12,
  },
  emptyText: {
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
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  exploreAllBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
});
