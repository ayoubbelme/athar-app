import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { OrganizationApplicationItem } from '../../types/organization.types';
import { translateApplicationStatus } from '../../utils/status.util';
import { AppVectorIcon } from '../common/AppVectorIcon';
import { MatchDonutChart } from '../common/MatchDonutChart';

export interface OrgApplicantCardProps {
  item: OrganizationApplicationItem;
  processingId: string | null;
  onDecision: (
    applicationId: string,
    decision: 'ACCEPTED' | 'REJECTED',
  ) => void;
  onOpenCompleteModal: (item: OrganizationApplicationItem) => void;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export const OrgApplicantCard: React.FC<OrgApplicantCardProps> = ({
  item,
  processingId,
  onDecision,
  onOpenCompleteModal,
}) => {
  const { colors } = useTheme();
  const {
    id,
    status,
    matchScore,
    message,
    project,
    volunteerImpact,
    createdAt,
  } = item;
  const applicant = item.volunteer ?? item.user;
  const isProcessing = processingId === id;

  const isPending = status === 'PENDING';
  const isAccepted = status === 'ACCEPTED';
  const isCompleted = status === 'COMPLETED';
  const isRejected = status === 'REJECTED';

  const volunteerName = applicant?.name ?? 'متطوع مسجل';
  const volunteerEmail = applicant?.email ?? '';
  const volunteerLocation = applicant?.location ?? null;
  const rawSkills = Array.isArray(applicant?.skills) ? applicant!.skills! : [];

  const accentColor = isCompleted
    ? '#38BDF8'
    : isAccepted
    ? colors.primary
    : isPending
    ? '#F59E0B'
    : colors.error;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, isCompleted && styles.cardCompleted]}>
      <View style={[styles.statusStrip, { backgroundColor: accentColor }]} />

      {/* Top Row: Volunteer Identity + Status Badge on Right, Match Donut Chart on Left */}
      <View style={styles.headerRow}>
        <View style={styles.volunteerCol}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarCircle, { backgroundColor: 'rgba(0, 186, 102, 0.14)', borderColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {volunteerName.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.nameBox}>
              <View style={styles.nameAndBadgeRow}>
                <Text style={[styles.volunteerName, { color: colors.text }]} numberOfLines={1}>
                  {volunteerName}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    isPending && styles.badgePending,
                    isAccepted && styles.badgeAccepted,
                    isCompleted && styles.badgeCompleted,
                    isRejected && styles.badgeRejected,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isPending && styles.textPending,
                      isAccepted && { color: colors.primary },
                      isCompleted && styles.textCompleted,
                      isRejected && { color: colors.error },
                    ]}
                  >
                    {translateApplicationStatus(status)}
                  </Text>
                </View>
              </View>

              {Boolean(volunteerEmail) && (
                <Text style={[styles.volunteerEmail, { color: colors.textSecondary }]}>{volunteerEmail}</Text>
              )}
            </View>
          </View>
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

      {/* Target Opportunity Banner */}
      <View style={[styles.projectBanner, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
        <View style={styles.projectBannerHeader}>
          <AppVectorIcon
            name="target"
            size={12}
            color={colors.textSecondary}
          />
          <Text style={[styles.projectLabel, { color: colors.textSecondary }]}>الفرصة المتقدم إليها:</Text>
        </View>
        <Text style={[styles.projectTitle, { color: colors.primary }]} numberOfLines={1}>
          {project?.title ?? 'مشروع تطوعي'}
        </Text>
      </View>

      {/* Meta Chips: Date & Location */}
      <View style={styles.metaRow}>
        <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <AppVectorIcon
            name="calendar"
            size={12}
            color={colors.textSecondary}
          />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatDate(createdAt)}</Text>
        </View>

        {Boolean(volunteerLocation) && (
          <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <AppVectorIcon
              name="location"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{volunteerLocation}</Text>
          </View>
        )}
      </View>

      {/* Volunteer Skills */}
      {rawSkills.length > 0 && (
        <View style={styles.skillsWrap}>
          {rawSkills.slice(0, 4).map((s, idx) => {
            const skillName = s?.skill?.name ?? s?.name ?? 'مهارة';
            return (
              <View key={s?.skill?.id ?? idx} style={[styles.skillChip, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                <AppVectorIcon name="bolt" size={11} color={colors.primary} />
                <Text style={[styles.skillChipText, { color: colors.text }]}>{skillName}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Volunteer Motivation Message */}
      {Boolean(message) && (
        <View style={[styles.messageBox, { backgroundColor: colors.surfaceLight }]}>
          <Text style={[styles.messageLabel, { color: colors.textSecondary }]}>رسالة المتطوع:</Text>
          <Text style={[styles.messageText, { color: colors.text }]}>"{message}"</Text>
        </View>
      )}

      {/* Verified Impact Box if COMPLETED */}
      {isCompleted && volunteerImpact && (
        <View style={[styles.verifiedImpactBox, { borderColor: colors.primary }]}>
          <View style={styles.verifiedHeaderRow}>
            <AppVectorIcon name="trophy" size={14} color={colors.primary} />
            <Text style={[styles.verifiedImpactTitle, { color: colors.primary }]}>
              الأثر المعتمد من الجمعية لهذا المتطوع:
            </Text>
          </View>

          <View style={styles.verifiedMetricsRow}>
            <View style={[styles.verifiedMetricChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <AppVectorIcon name="clock" size={12} color={colors.primary} />
              <Text style={[styles.verifiedMetricPill, { color: colors.text }]}>
                {volunteerImpact.hours} ساعة
              </Text>
            </View>
            <View style={[styles.verifiedMetricChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <AppVectorIcon name="bolt" size={12} color={colors.primary} />
              <Text style={[styles.verifiedMetricPill, { color: colors.text }]}>
                {volunteerImpact.activitiesCount} نشاط
              </Text>
            </View>
            <View style={[styles.verifiedMetricChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <AppVectorIcon name="users" size={12} color={colors.primary} />
              <Text style={[styles.verifiedMetricPill, { color: colors.text }]}>
                {volunteerImpact.beneficiariesCount} مستفيد
              </Text>
            </View>
          </View>

          {Boolean(volunteerImpact.description) && (
            <Text style={[styles.verifiedDescText, { color: colors.textSecondary }]} numberOfLines={2}>
              "{volunteerImpact.description}"
            </Text>
          )}
        </View>
      )}

      {/* Decision Buttons for PENDING requests */}
      {isPending && (
        <View style={[styles.decisionRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: colors.primary }, isProcessing && styles.btnDisabled]}
            onPress={() => onDecision(id, 'ACCEPTED')}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <View style={styles.btnContentRow}>
                <AppVectorIcon
                  name="check"
                  size={14}
                  color={colors.background}
                />
                <Text style={[styles.acceptBtnText, { color: colors.background }]}>قبول المتطوع</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectBtn, { borderColor: colors.error }, isProcessing && styles.btnDisabled]}
            onPress={() => onDecision(id, 'REJECTED')}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            <View style={styles.btnContentRow}>
              <AppVectorIcon name="close" size={12} color={colors.error} />
              <Text style={[styles.rejectBtnText, { color: colors.error }]}>رفض</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons for ACCEPTED requests: Confirm Task Completion & Set Impact */}
      {isAccepted && (
        <View style={[styles.decisionRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.completeBtn, { backgroundColor: colors.primary }, isProcessing && styles.btnDisabled]}
            onPress={() => onOpenCompleteModal(item)}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <View style={styles.btnContentRow}>
                <AppVectorIcon
                  name="trophy"
                  size={14}
                  color={colors.background}
                />
                <Text style={[styles.completeBtnText, { color: colors.background }]}>
                  تأكيد الإنجاز وتحديد الساعات والأثر
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectBtn, { borderColor: colors.error }, isProcessing && styles.btnDisabled]}
            onPress={() => onDecision(id, 'REJECTED')}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            <Text style={[styles.rejectBtnText, { color: colors.error }]}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Allow Organization to Edit Verified Impact on COMPLETED requests */}
      {isCompleted && (
        <View style={[styles.decisionRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.editImpactBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.primary }, isProcessing && styles.btnDisabled]}
            onPress={() => onOpenCompleteModal(item)}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            <AppVectorIcon name="sparkle" size={13} color={colors.primary} />
            <Text style={[styles.editImpactBtnText, { color: colors.primary }]}>
              تعديل الساعات والأثر الممنوح للمتطوع
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OrgApplicantCard;

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    padding: 16,
    paddingRight: 20,
    borderWidth: 1,
    gap: 12,
  },
  cardCompleted: {
    borderColor: 'rgba(56, 189, 248, 0.45)',
    borderWidth: 1.5,
  },
  statusStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 4.5,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  volunteerCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  avatarRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '900',
  },
  nameBox: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  nameAndBadgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  volunteerName: {
    fontSize: 16.5,
    fontWeight: '900',
    textAlign: 'right',
  },
  volunteerEmail: {
    fontSize: 12,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgePending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
  },
  badgeAccepted: {
    backgroundColor: 'rgba(0, 186, 102, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 186, 102, 0.45)',
  },
  badgeCompleted: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.45)',
  },
  badgeRejected: {
    backgroundColor: 'rgba(255, 90, 95, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.45)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textPending: {
    color: '#F59E0B',
  },
  textCompleted: {
    color: '#38BDF8',
  },
  projectBanner: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'flex-end',
    gap: 3,
    borderWidth: 1,
  },
  projectBannerHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  projectLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  skillsWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  messageBox: {
    borderRadius: 12,
    padding: 10,
    alignItems: 'flex-end',
    gap: 3,
  },
  messageLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  messageText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  verifiedImpactBox: {
    backgroundColor: 'rgba(0, 186, 102, 0.1)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  verifiedHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  verifiedImpactTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  verifiedMetricsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  verifiedMetricChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  verifiedMetricPill: {
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedDescText: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  decisionRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  btnContentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  acceptBtn: {
    flex: 1.4,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  completeBtn: {
    flex: 1.8,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  editImpactBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImpactBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  rejectBtn: {
    flex: 0.7,
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
