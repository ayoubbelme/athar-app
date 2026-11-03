import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { VolunteerApplicationItem } from '../../types/requests.types';
import { translateApplicationStatus } from '../../utils/status.util';
import { translateStatus } from '../../utils/arabic.util';
import { AppVectorIcon } from '../common/AppVectorIcon';
import { MatchDonutChart } from '../common/MatchDonutChart';

interface RequestStatusCardProps {
  item: VolunteerApplicationItem;
  onWithdraw: (applicationId: string) => void;
  withdrawingId: string | null;
}

function formatIsoDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export const RequestStatusCard: React.FC<RequestStatusCardProps> = ({
  item,
  onWithdraw,
  withdrawingId,
}) => {
  const {
    id,
    status,
    matchScore,
    message,
    project,
    volunteerImpact,
    createdAt,
  } = item;
  const isWithdrawing = withdrawingId === id;

  const isPending = status === 'PENDING';
  const isAccepted = status === 'ACCEPTED';
  const isCompleted = status === 'COMPLETED';
  const isRejected = status === 'REJECTED';
  const isWithdrawn = status === 'WITHDRAWN';

  const formattedDate = formatIsoDate(createdAt);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.orgAndStatusRow}>
            <Text style={styles.orgName}>
              {project?.organization?.name ?? 'جمعية'}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isAccepted && styles.badgeAccepted,
                isCompleted && styles.badgeCompleted,
                isPending && styles.badgePending,
                isRejected && styles.badgeRejected,
                isWithdrawn && styles.badgeWithdrawn,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isAccepted && styles.textAccepted,
                  isCompleted && styles.textCompleted,
                  isPending && styles.textPending,
                  isRejected && styles.textRejected,
                  isWithdrawn && styles.textWithdrawn,
                ]}
              >
                {translateApplicationStatus(status)}
              </Text>
            </View>
          </View>
          <Text style={styles.projectTitle}>{project?.title ?? ''}</Text>
        </View>

        {matchScore !== null && matchScore !== undefined && (
          <MatchDonutChart
            score={matchScore}
            size={52}
            strokeWidth={5}
            label="توافق"
          />
        )}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <AppVectorIcon
            name="calendar"
            size={13}
            color={COLORS.textSecondary}
          />
          <Text style={styles.metaDate}>تاريخ الطلب: {formattedDate}</Text>
        </View>

        {project && Boolean(project.location) && (
          <View style={styles.metaItem}>
            <AppVectorIcon
              name="location"
              size={13}
              color={COLORS.textSecondary}
            />
            <Text style={styles.projectLocation}>{project.location}</Text>
          </View>
        )}
      </View>

      {Boolean(message) && (
        <View style={styles.messageBox}>
          <Text style={styles.messageLabel}>رسالتك للجمعية:</Text>
          <Text style={styles.messageText} numberOfLines={2}>
            "{message}"
          </Text>
        </View>
      )}

      {project && (
        <View style={styles.projectInfoRow}>
          <Text style={styles.projectStatusLabel}>
            حالة المشروع: {translateStatus(project.status)}
          </Text>
        </View>
      )}

      {isAccepted && (
        <View style={styles.acceptedHintBox}>
          <AppVectorIcon name="clock" size={14} color={COLORS.primary} />
          <Text style={styles.acceptedHintText}>
            بعد إتمامك للمهمة، ستقوم الجمعية بتأكيد إنجازك واعتماد ساعات تطوعك وأثرك تلقائياً.
          </Text>
        </View>
      )}

      {isCompleted && (
        <View style={styles.impactSummaryBox}>
          <View style={styles.impactTitleRow}>
            <AppVectorIcon name="trophy" size={15} color={COLORS.primary} />
            <Text style={styles.impactSummaryTitle}>
              الأثر المعتمد من طرف الجمعية
            </Text>
          </View>
          {volunteerImpact ? (
            <>
              <View style={styles.impactMetricsRow}>
                <View style={styles.impactMetricChip}>
                  <AppVectorIcon name="clock" size={12} color={COLORS.primary} />
                  <Text style={styles.impactMetricPill}>
                    {volunteerImpact.hours} ساعة معتمدة
                  </Text>
                </View>
                <View style={styles.impactMetricChip}>
                  <AppVectorIcon name="bolt" size={12} color={COLORS.primary} />
                  <Text style={styles.impactMetricPill}>
                    {volunteerImpact.activitiesCount} نشاط
                  </Text>
                </View>
                <View style={styles.impactMetricChip}>
                  <AppVectorIcon name="users" size={12} color={COLORS.primary} />
                  <Text style={styles.impactMetricPill}>
                    {volunteerImpact.beneficiariesCount} مستفيد
                  </Text>
                </View>
              </View>
              {Boolean(volunteerImpact.description) && (
                <Text style={styles.impactDescText}>
                  تقييم الجمعية: "{volunteerImpact.description}"
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.impactDescText}>
              تم تأكيد إتمام المهمة وإضافة النقاط إلى رصيد أثرك.
            </Text>
          )}
        </View>
      )}

      {(isPending ||
        (isAccepted &&
          (project?.status === 'PUBLISHED' ||
            project?.status === 'IN_PROGRESS'))) && (
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[
              styles.withdrawBtn,
              isWithdrawing && styles.btnDisabled,
            ]}
            onPress={() => onWithdraw(id)}
            disabled={isWithdrawing}
            activeOpacity={0.8}
          >
            {isWithdrawing ? (
              <ActivityIndicator color={COLORS.error} size="small" />
            ) : (
              <Text style={styles.withdrawText}>إلغاء الطلب</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
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
  orgAndStatusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  orgName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'right',
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePending: {
    backgroundColor: 'rgba(255, 193, 7, 0.16)',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  badgeAccepted: {
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeCompleted: {
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  badgeRejected: {
    backgroundColor: 'rgba(255, 90, 95, 0.16)',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  badgeWithdrawn: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textPending: {
    color: '#FFC107',
  },
  textAccepted: {
    color: COLORS.primary,
  },
  textCompleted: {
    color: '#38BDF8',
  },
  textRejected: {
    color: COLORS.error,
  },
  textWithdrawn: {
    color: COLORS.textSecondary,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  metaDate: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
  },
  messageBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 10,
    gap: 4,
    alignItems: 'flex-end',
  },
  messageLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  messageText: {
    fontSize: 13,
    color: COLORS.text,
    fontStyle: 'italic',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  projectInfoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStatusLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  projectLocation: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
  },
  acceptedHintBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  acceptedHintText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 18,
  },
  impactSummaryBox: {
    backgroundColor: 'rgba(0, 186, 102, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  impactTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  impactSummaryTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
  impactMetricsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  impactMetricChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  impactMetricPill: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  impactDescText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  footerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  withdrawBtn: {
    backgroundColor: 'rgba(255, 90, 95, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  withdrawText: {
    color: COLORS.error,
    fontSize: 12.5,
    fontWeight: '700',
  },
});