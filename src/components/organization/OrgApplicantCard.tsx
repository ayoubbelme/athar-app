import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { OrganizationApplicationItem } from '../../types/organization.types';
import { translateApplicationStatus } from '../../utils/status.util';

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
  const { id, status, matchScore, message, project, volunteerImpact, createdAt } =
    item;
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
    ? COLORS.primary
    : isPending
    ? '#FFC107'
    : isRejected
    ? COLORS.error
    : COLORS.border;

  const initials = volunteerName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>

      {/* ── Header: avatar + name + status ──────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { borderColor: accentColor }]}>
            <Text style={[styles.avatarText, { color: accentColor }]}>
              {initials}
            </Text>
          </View>
          <View style={styles.nameBox}>
            <Text style={styles.volunteerName}>{volunteerName}</Text>
            {Boolean(volunteerEmail) && (
              <Text style={styles.volunteerEmail}>{volunteerEmail}</Text>
            )}
          </View>
        </View>

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
              isAccepted && styles.textAccepted,
              isCompleted && styles.textCompleted,
              isRejected && styles.textRejected,
            ]}
          >
            {translateApplicationStatus(status)}
          </Text>
        </View>
      </View>

      {/* ── Opportunity banner ──────────────────────────────────────────── */}
      <View style={styles.projectBanner}>
        <Text style={styles.projectLabel}>📌 الفرصة المتقدم إليها</Text>
        <Text style={styles.projectTitle} numberOfLines={1}>
          {project?.title ?? 'مشروع تطوعي'}
        </Text>
      </View>

      {/* ── Meta row ────────────────────────────────────────────────────── */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaText}>📅 {formatDate(createdAt)}</Text>
        </View>
        {Boolean(volunteerLocation) && (
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>📍 {volunteerLocation}</Text>
          </View>
        )}
        {matchScore !== null && matchScore !== undefined && (
          <View style={styles.matchPill}>
            <Text style={styles.matchPillText}>⭐ {matchScore}% توافق</Text>
          </View>
        )}
      </View>

      {/* ── Skills ──────────────────────────────────────────────────────── */}
      {rawSkills.length > 0 && (
        <View style={styles.skillsWrap}>
          {rawSkills.slice(0, 4).map((s, idx) => {
            const skillName = s?.skill?.name ?? s?.name ?? 'مهارة';
            return (
              <View key={s?.skill?.id ?? idx} style={styles.skillChip}>
                <Text style={styles.skillChipText}>⚡ {skillName}</Text>
              </View>
            );
          })}
          {rawSkills.length > 4 && (
            <View style={styles.skillChipMore}>
              <Text style={styles.skillChipText}>+{rawSkills.length - 4}</Text>
            </View>
          )}
        </View>
      )}

      {/* ── Motivation message ──────────────────────────────────────────── */}
      {Boolean(message) && (
        <View style={styles.messageBox}>
          <Text style={styles.messageLabel}>💬 رسالة المتطوع</Text>
          <Text style={styles.messageText}>"{message}"</Text>
        </View>
      )}

      {/* ── Verified impact when COMPLETED ─────────────────────────────── */}
      {isCompleted && volunteerImpact && (
        <View style={styles.verifiedImpactBox}>
          <Text style={styles.verifiedImpactTitle}>✅ الأثر المعتمد</Text>
          <View style={styles.verifiedMetricsRow}>
            <View style={styles.verifiedMetricPill}>
              <Text style={styles.verifiedMetricValue}>{volunteerImpact.hours}</Text>
              <Text style={styles.verifiedMetricSub}>ساعة</Text>
            </View>
            <View style={styles.verifiedMetricPill}>
              <Text style={styles.verifiedMetricValue}>{volunteerImpact.activitiesCount}</Text>
              <Text style={styles.verifiedMetricSub}>نشاط</Text>
            </View>
            <View style={styles.verifiedMetricPill}>
              <Text style={styles.verifiedMetricValue}>{volunteerImpact.beneficiariesCount}</Text>
              <Text style={styles.verifiedMetricSub}>مستفيد</Text>
            </View>
          </View>
          {Boolean(volunteerImpact.description) && (
            <Text style={styles.verifiedDescText} numberOfLines={2}>
              📝 {volunteerImpact.description}
            </Text>
          )}
        </View>
      )}

      {/* ── PENDING: Accept / Reject ────────────────────────────────────── */}
      {isPending && (
        <View style={styles.decisionRow}>
          <TouchableOpacity
            style={[styles.acceptBtn, isProcessing && styles.btnDisabled]}
            onPress={() => onDecision(id, 'ACCEPTED')}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator color={COLORS.background} size="small" />
            ) : (
              <Text style={styles.acceptBtnText}>✓ قبول</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectBtn, isProcessing && styles.btnDisabled]}
            onPress={() => onDecision(id, 'REJECTED')}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            <Text style={styles.rejectBtnText}>✕ رفض</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── ACCEPTED: Confirm completion ────────────────────────────────── */}
      {isAccepted && (
        <View style={styles.decisionRow}>
          <TouchableOpacity
            style={[styles.completeBtn, isProcessing && styles.btnDisabled]}
            onPress={() => onOpenCompleteModal(item)}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator color={COLORS.background} size="small" />
            ) : (
              <Text style={styles.completeBtnText}>🏆 تأكيد إنجاز المهمة وتحديد الأثر</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectBtn, isProcessing && styles.btnDisabled]}
            onPress={() => onDecision(id, 'REJECTED')}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            <Text style={styles.rejectBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── COMPLETED: Edit impact ──────────────────────────────────────── */}
      {isCompleted && (
        <TouchableOpacity
          style={[styles.editImpactBtn, isProcessing && styles.btnDisabled]}
          onPress={() => onOpenCompleteModal(item)}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          <Text style={styles.editImpactBtnText}>✏️ تعديل الساعات والأثر الممنوح</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrgApplicantCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    gap: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  avatarRow: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 186, 102, 0.1)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800' },
  nameBox: { flex: 1, alignItems: 'flex-end', gap: 2 },
  volunteerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  volunteerEmail: { fontSize: 11.5, color: COLORS.textSecondary, textAlign: 'right' },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  badgePending: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  badgeAccepted: {
    backgroundColor: 'rgba(0, 186, 102, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeCompleted: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  badgeRejected: {
    backgroundColor: 'rgba(255, 90, 95, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  statusText: { fontSize: 11.5, fontWeight: '800' },
  textPending: { color: '#FFC107' },
  textAccepted: { color: COLORS.primary },
  textCompleted: { color: '#38BDF8' },
  textRejected: { color: COLORS.error },

  // ── Project banner ────────────────────────────────────────────────────────
  projectBanner: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'flex-end',
    gap: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  projectLabel: { fontSize: 10.5, fontWeight: '700', color: COLORS.textSecondary },
  projectTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  // ── Meta row ─────────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: { flexDirection: 'row-reverse', alignItems: 'center' },
  metaText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  matchPill: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(0, 186, 102, 0.13)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  matchPillText: { fontSize: 11.5, fontWeight: '800', color: COLORS.primary },

  // ── Skills ────────────────────────────────────────────────────────────────
  skillsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  skillChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skillChipMore: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    opacity: 0.7,
  },
  skillChipText: { fontSize: 11.5, color: COLORS.text, fontWeight: '600' },

  // ── Message box ───────────────────────────────────────────────────────────
  messageBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 11,
    alignItems: 'flex-end',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  messageText: {
    fontSize: 13,
    color: COLORS.text,
    fontStyle: 'italic',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 19,
  },

  // ── Verified impact ───────────────────────────────────────────────────────
  verifiedImpactBox: {
    backgroundColor: 'rgba(0, 186, 102, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 14,
    padding: 13,
    alignItems: 'flex-end',
    gap: 10,
  },
  verifiedImpactTitle: { fontSize: 12.5, fontWeight: '800', color: COLORS.primary },
  verifiedMetricsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    justifyContent: 'flex-end',
  },
  verifiedMetricPill: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 60,
  },
  verifiedMetricValue: { fontSize: 17, fontWeight: '900', color: COLORS.text },
  verifiedMetricSub: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600', marginTop: 1 },
  verifiedDescText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 18,
  },

  // ── Decision row ──────────────────────────────────────────────────────────
  decisionRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  acceptBtn: {
    flex: 1.4,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: { color: COLORS.background, fontSize: 14, fontWeight: '800' },
  completeBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnText: { color: COLORS.background, fontSize: 12.5, fontWeight: '800', textAlign: 'center' },
  editImpactBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImpactBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
  rejectBtn: {
    flex: 0.5,
    backgroundColor: 'rgba(255, 90, 95, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: { color: COLORS.error, fontSize: 13, fontWeight: '800' },
  btnDisabled: { opacity: 0.6 },
});