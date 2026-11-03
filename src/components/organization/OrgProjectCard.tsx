import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
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
    <View style={styles.card}>
      {/* Top Row: Category & Status Badge */}
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <View style={styles.badgesWrap}>
            {project.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {translateCategory(project.category)}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.statusBadge,
                isPublished || isInProgress
                  ? styles.statusOpen
                  : styles.statusClosed,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isPublished || isInProgress
                    ? styles.statusTextOpen
                    : styles.statusTextClosed,
                ]}
              >
                {translateStatus(project.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
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
      <Text style={styles.description} numberOfLines={1}>
        {project.description}
      </Text>

      {/* Meta & Skills */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {project.location ? `📍 ${project.location}` : '📍 عن بُعد / مرن'}
        </Text>
        <Text style={styles.metaText}>
          👥 المقبولون: {project.acceptedVolunteers ?? 0}
          {project.maxVolunteers ? ` / ${project.maxVolunteers}` : ''}
        </Text>

        {skillsList.slice(0, 2).map((req) => (
          <View key={req.skill.id} style={styles.skillChip}>
            <Text style={styles.skillChipText}>{req.skill.name}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons: View Incoming Requests + Change Status */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.requestsBtn}
          onPress={() => onPressViewRequests(project)}
          activeOpacity={0.85}
        >
          <Text style={styles.requestsBtnText}>
            مراجعة المتقدمين {pendingCount > 0 ? `(${pendingCount})` : ''}
          </Text>
        </TouchableOpacity>

        {!isTerminal && (
          <TouchableOpacity
            style={[styles.statusBtn, isUpdating && styles.btnDisabled]}
            onPress={() => onPressToggleStatus(project, nextStatus)}
            disabled={isUpdating}
            activeOpacity={0.85}
          >
            {isUpdating ? (
              <ActivityIndicator color={COLORS.text} size="small" />
            ) : (
              <Text style={styles.statusBtnText}>{toggleLabel}</Text>
            )}
          </TouchableOpacity>
        )}
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
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusOpen: {
    backgroundColor: 'rgba(0, 186, 102, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statusClosed: {
    backgroundColor: COLORS.surfaceLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextOpen: {
    color: COLORS.primary,
  },
  statusTextClosed: {
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
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
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  skillChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skillChipText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  requestsBtn: {
    flex: 1.3,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestsBtnText: {
    color: COLORS.background,
    fontSize: 13.5,
    fontWeight: '800',
  },
  statusBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBtnText: {
    color: COLORS.text,
    fontSize: 12.5,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});