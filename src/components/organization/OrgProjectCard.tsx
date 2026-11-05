import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ProjectItem, ProjectStatus } from '../../types/volunteer-home.types';
import { translateCategory, translateStatus } from '../../utils/arabic.util';

interface OrgProjectCardProps {
  project: ProjectItem;
  pendingCount?: number;
  updatingId: string | null;
  onPressViewRequests: (project: ProjectItem) => void;
  onPressToggleStatus: (project: ProjectItem, nextStatus: ProjectStatus) => void;
}

export const OrgProjectCard: React.FC<OrgProjectCardProps> = ({
  project,
  pendingCount = 0,
  updatingId,
  onPressViewRequests,
  onPressToggleStatus,
}) => {
  const { colors } = useTheme();
  const isUpdating = updatingId === project.id;
  const isPublished = project.status === 'PUBLISHED';
  const isInProgress = project.status === 'IN_PROGRESS';
  const isDraft = project.status === 'DRAFT';
  const isTerminal =
    project.status === 'COMPLETED' || project.status === 'CANCELLED';
  const skillsList = Array.isArray(project.skills) ? project.skills : [];

  let nextStatus: ProjectStatus = 'IN_PROGRESS';
  let toggleLabel = 'بدء التنفيذ (قيد التنفيذ)';

  if (isDraft) {
    nextStatus = 'PUBLISHED';
    toggleLabel = 'نشر الفرصة الآن';
  } else if (isPublished) {
    nextStatus = 'IN_PROGRESS';
    toggleLabel = 'بدء التنفيذ ▶';
  } else if (isInProgress) {
    nextStatus = 'COMPLETED';
    toggleLabel = 'إتمام المشروع ✓';
  } else {
    toggleLabel = 'المشروع مغلق';
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Top Row: Category & Status Badge */}
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <View style={styles.badgesWrap}>
            {project.category && (
              <View style={[styles.categoryBadge, { backgroundColor: colors.surfaceLight }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {translateCategory(project.category)}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.statusBadge,
                isPublished || isInProgress
                  ? { backgroundColor: 'rgba(0, 186, 102, 0.15)', borderWidth: 1, borderColor: colors.primary }
                  : { backgroundColor: colors.surfaceLight },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isPublished || isInProgress
                    ? { color: colors.primary }
                    : { color: colors.textSecondary },
                ]}
              >
                {translateStatus(project.status)}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {project.title}
          </Text>
        </View>

        {pendingCount > 0 && (
          <View style={styles.pendingPill}>
            <Text style={styles.pendingPillText}>
              🔔 {pendingCount} طلب جديد
            </Text>
          </View>
        )}
      </View>

      {/* Short 1-Line Summary */}
      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
        {project.description}
      </Text>

      {/* Meta & Skills */}
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {project.location ? `📍 ${project.location}` : '📍 عن بُعد / مرن'}
        </Text>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          👥 المقبولون: {project.acceptedVolunteers ?? 0}
          {project.maxVolunteers ? ` / ${project.maxVolunteers}` : ''}
        </Text>

        {skillsList.slice(0, 2).map((req) => (
          <View key={req.skill.id} style={[styles.skillChip, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
            <Text style={[styles.skillChipText, { color: colors.text }]}>{req.skill.name}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons: View Incoming Requests + Change Status */}
      <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.requestsBtn, { backgroundColor: colors.primary }]}
          onPress={() => onPressViewRequests(project)}
          activeOpacity={0.85}
        >
          <Text style={[styles.requestsBtnText, { color: colors.background }]}>
            مراجعة المتقدمين {pendingCount > 0 ? `(${pendingCount})` : ''}
          </Text>
        </TouchableOpacity>

        {!isTerminal && (
          <TouchableOpacity
            style={[styles.statusBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.border }, isUpdating && styles.btnDisabled]}
            onPress={() => onPressToggleStatus(project, nextStatus)}
            disabled={isUpdating}
            activeOpacity={0.85}
          >
            {isUpdating ? (
              <ActivityIndicator color={colors.text} size="small" />
            ) : (
              <Text style={[styles.statusBtnText, { color: colors.text }]}>{toggleLabel}</Text>
            )}
          </TouchableOpacity>
        )}
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
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
  },
  badgesWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 23,
  },
  pendingPill: {
    backgroundColor: 'rgba(255, 193, 7, 0.18)',
    borderWidth: 1,
    borderColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  pendingPillText: {
    color: '#FFC107',
    fontSize: 11.5,
    fontWeight: '800',
  },
  description: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    paddingTop: 2,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  skillChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 1,
  },
  skillChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  requestsBtn: {
    flex: 1.3,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestsBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  statusBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
