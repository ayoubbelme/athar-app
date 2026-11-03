import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
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
  const { project, matchScore, alreadyApplied } = item;
  const isApplying = applyingId === project.id;
  const isOpen = project.status === 'PUBLISHED';
  const isFull =
    project.maxVolunteers !== null &&
    project.acceptedVolunteers >= project.maxVolunteers;

  const canApply = isOpen && !isFull && !alreadyApplied;
  const skillsList = Array.isArray(project.skills) ? project.skills : [];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.orgRow}>
            <Text style={styles.orgName}>
              {project.organization?.name ?? 'جمعية'}
            </Text>
            {project.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {translateCategory(project.category)}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.statusPill,
                isOpen ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isOpen ? styles.statusTextOpen : styles.statusTextClosed,
                ]}
              >
                {translateStatus(project.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.projectTitle} numberOfLines={2}>
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

      <Text style={styles.description} numberOfLines={1}>
        {project.description}
      </Text>

      <View style={styles.metaWrap}>
        <View style={styles.metaItem}>
          <AppVectorIcon
            name="location"
            size={13}
            color={COLORS.textSecondary}
          />
          <Text style={styles.metaText}>
            {project.location ? project.location : 'عن بُعد / مرن'}
          </Text>
        </View>

        {project.maxVolunteers !== null && (
          <View style={styles.metaItem}>
            <AppVectorIcon
              name="users"
              size={13}
              color={COLORS.textSecondary}
            />
            <Text style={styles.metaText}>
              {project.acceptedVolunteers}/{project.maxVolunteers} متطوع
            </Text>
          </View>
        )}

        {skillsList.slice(0, 2).map((req) => (
          <View key={req.skill.id} style={styles.skillChip}>
            <Text style={styles.skillChipText}>{req.skill.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        {alreadyApplied ? (
          <View style={styles.appliedBadge}>
            <AppVectorIcon name="check" size={14} color={COLORS.primary} />
            <Text style={styles.appliedBadgeText}>تم التقديم مسبقاً</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.applyBtn,
              (!canApply || isApplying) && styles.applyBtnDisabled,
            ]}
            onPress={() => onApply(project.id)}
            disabled={!canApply || isApplying}
            activeOpacity={0.85}
          >
            {isApplying ? (
              <ActivityIndicator color={COLORS.background} size="small" />
            ) : (
              <Text style={styles.applyBtnText}>
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
          style={styles.detailsBtn}
          onPress={() => onPressDetails(item)}
          activeOpacity={0.85}
        >
          <Text style={styles.detailsBtnText}>عرض التفاصيل</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.primary,
  },
  categoryBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 23,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusOpen: {
    backgroundColor: COLORS.surfaceLight,
  },
  statusClosed: {
    backgroundColor: 'rgba(155, 176, 165, 0.12)',
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  statusTextOpen: {
    color: COLORS.text,
  },
  statusTextClosed: {
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  skillChip: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  skillChipText: {
    color: COLORS.text,
    fontSize: 11.5,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyBtn: {
    flex: 1.3,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.65,
  },
  applyBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
  },
  appliedBadge: {
    flex: 1.3,
    flexDirection: 'row-reverse',
    gap: 6,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedBadgeText: {
    color: COLORS.primary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  detailsBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: COLORS.text,
    fontSize: 13.5,
    fontWeight: '700',
  },
});