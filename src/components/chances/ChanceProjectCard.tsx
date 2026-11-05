import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ChanceCardViewModel } from '../../types/chances.types';
import {
  translateCategory,
  translateStatus,
} from '../../utils/arabic.util';
import { MatchDonutChart } from '../common/MatchDonutChart';
import { AppVectorIcon } from '../common/AppVectorIcon';

interface ChanceProjectCardProps {
  item: ChanceCardViewModel;
  onApply: (projectId: string) => void;
  onPressDetails: (item: ChanceCardViewModel) => void;
  applyingId: string | null;
}

export const ChanceProjectCard: React.FC<ChanceProjectCardProps> = ({
  item,
  onApply,
  onPressDetails,
  applyingId,
}) => {
  const { colors } = useTheme();
  const { project, matchScore, alreadyApplied } = item;
  const isApplying = applyingId === project.id;
  const isOpen = project.status === 'PUBLISHED';
  const isFull =
    project.maxVolunteers !== null &&
    project.acceptedVolunteers >= project.maxVolunteers;

  const canApply = isOpen && !isFull && !alreadyApplied;
  const skillsList = Array.isArray(project.skills) ? project.skills : [];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.orgRow}>
            <Text style={[styles.orgName, { color: colors.primary }]}>
              {project.organization?.name ?? 'جمعية'}
            </Text>
            {project.category && (
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <Text
                  style={[
                    styles.categoryBadgeText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {translateCategory(project.category)}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.statusPill,
                isOpen
                  ? { backgroundColor: colors.surfaceLight }
                  : { backgroundColor: 'rgba(155, 176, 165, 0.12)' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isOpen
                    ? { color: colors.text }
                    : { color: colors.textSecondary },
                ]}
              >
                {translateStatus(project.status)}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.projectTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {project.title}
          </Text>
        </View>

        {matchScore !== null && matchScore !== undefined && (
          <MatchDonutChart
            score={matchScore}
            size={54}
            strokeWidth={5}
            label="توافق"
          />
        )}
      </View>

      <Text
        style={[styles.description, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {project.description}
      </Text>

      <View style={styles.metaWrap}>
        <View style={styles.metaItem}>
          <AppVectorIcon
            name="location"
            size={13}
            color={colors.textSecondary}
          />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {project.location ? project.location : 'عن بُعد / مرن'}
          </Text>
        </View>

        {project.maxVolunteers !== null && (
          <View style={styles.metaItem}>
            <AppVectorIcon
              name="users"
              size={13}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {project.acceptedVolunteers}/{project.maxVolunteers} متطوع
            </Text>
          </View>
        )}

        {skillsList.slice(0, 2).map((req) => (
          <View
            key={req.skill.id}
            style={[
              styles.skillChip,
              {
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.skillChipText, { color: colors.text }]}>
              {req.skill.name}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.footerRow,
          { borderTopColor: colors.border },
        ]}
      >
        {alreadyApplied ? (
          <View
            style={[
              styles.appliedBadge,
              {
                backgroundColor: 'rgba(0, 186, 102, 0.12)',
                borderColor: colors.primary,
              },
            ]}
          >
            <AppVectorIcon name="check" size={14} color={colors.primary} />
            <Text style={[styles.appliedBadgeText, { color: colors.primary }]}>
              تم التقديم مسبقاً
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.applyBtn,
              { backgroundColor: colors.primary },
              (!canApply || isApplying) && {
                backgroundColor: colors.surfaceLight,
                opacity: 0.65,
              },
            ]}
            onPress={() => onApply(project.id)}
            disabled={!canApply || isApplying}
            activeOpacity={0.85}
          >
            {isApplying ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text style={[styles.applyBtnText, { color: colors.background }]}>
                {isFull
                  ? 'اكتمل العدد'
                  : isOpen
                  ? 'تقديم الآن'
                  : 'التقديم مغلق'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.detailsBtn,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onPressDetails(item)}
          activeOpacity={0.85}
        >
          <Text style={[styles.detailsBtnText, { color: colors.text }]}>
            عرض التفاصيل
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  titleCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  orgRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  orgName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 23,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    paddingTop: 2,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  skillChip: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  skillChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  applyBtn: {
    flex: 1.3,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  appliedBadge: {
    flex: 1.3,
    flexDirection: 'row-reverse',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedBadgeText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  detailsBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
});
