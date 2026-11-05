import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
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
  const isWithdrawing = withdrawingId === id;

  const isPending = status === 'PENDING';
  const isAccepted = status === 'ACCEPTED';
  const isCompleted = status === 'COMPLETED';
  const isRejected = status === 'REJECTED';
  const isWithdrawn = status === 'WITHDRAWN';

  const orgName = project?.organization?.name ?? 'جمعية معتمدة';
  const orgInitial = orgName.trim().charAt(0).toUpperCase() || 'ج';
  const formattedDate = formatIsoDate(createdAt);

  // Step progress calculation (1 = Applied, 2 = Accepted, 3 = Completed & Verified)
  const step2Reached = isAccepted || isCompleted;
  const step3Reached = isCompleted;

  const accentColor = isCompleted
    ? '#38BDF8'
    : isAccepted
    ? colors.primary
    : isPending
    ? '#F59E0B'
    : isRejected
    ? colors.error
    : colors.border;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, isCompleted && styles.cardCompleted]}>
      {/* Right Side Status Accent Strip */}
      <View style={[styles.statusStrip, { backgroundColor: accentColor }]} />

      {/* Top Row: Organization Pill + Status Badge + Title on Right, Match Donut on Left */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.orgAndStatusRow}>
            <View style={[styles.orgPill, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
              <View style={[styles.orgAvatarMini, { backgroundColor: colors.primary }]}>
                <Text style={[styles.orgAvatarMiniText, { color: colors.background }]}>{orgInitial}</Text>
              </View>
              <Text style={[styles.orgName, { color: colors.text }]} numberOfLines={1}>
                {orgName}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isAccepted && styles.badgeAccepted,
                isCompleted && styles.badgeCompleted,
                isPending && styles.badgePending,
                isRejected && styles.badgeRejected,
                isWithdrawn && { backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: accentColor }]}
              />
              <Text
                style={[
                  styles.statusText,
                  isAccepted && { color: colors.primary },
                  isCompleted && styles.textCompleted,
                  isPending && styles.textPending,
                  isRejected && { color: colors.error },
                  isWithdrawn && { color: colors.textSecondary },
                ]}
              >
                {translateApplicationStatus(status)}
              </Text>
            </View>
          </View>

          <Text style={[styles.projectTitle, { color: colors.text }]} numberOfLines={2}>
            {project?.title ?? 'مشروع تطوعي'}
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

      {/* 3-Step Visual Progress Tracker (Hidden if Withdrawn) */}
      {!isWithdrawn && (
        <View style={[styles.stepperContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
          {/* Step 1: Applied */}
          <View style={styles.stepCol}>
            <View style={[styles.stepCircle, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              <AppVectorIcon
                name="check"
                size={11}
                color={colors.background}
              />
            </View>
            <Text style={[styles.stepLabelActive, { color: colors.primary }]}>تقديم الطلب</Text>
          </View>

          {/* Line 1 -> 2 */}
          <View
            style={[
              styles.stepLine,
              { backgroundColor: colors.border },
              step2Reached && { backgroundColor: colors.primary },
              isRejected && { backgroundColor: colors.error },
            ]}
          />

          {/* Step 2: Organization Decision */}
          <View style={styles.stepCol}>
            <View
              style={[
                styles.stepCircle,
                { backgroundColor: colors.surface, borderColor: colors.border },
                step2Reached && { backgroundColor: colors.primary, borderColor: colors.primary },
                isRejected && { backgroundColor: colors.error, borderColor: colors.error },
              ]}
            >
              {isRejected ? (
                <AppVectorIcon
                  name="close"
                  size={10}
                  color={colors.background}
                />
              ) : step2Reached ? (
                <AppVectorIcon
                  name="check"
                  size={11}
                  color={colors.background}
                />
              ) : (
                <View style={[styles.stepInnerDot, { backgroundColor: colors.textSecondary }]} />
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                { color: colors.textSecondary },
                step2Reached && { color: colors.primary, fontWeight: '800' },
                isRejected && { color: colors.error, fontWeight: '800' },
              ]}
            >
              {isRejected ? 'تم الاعتذار' : 'قبول الجمعية'}
            </Text>
          </View>

          {/* Line 2 -> 3 */}
          <View
            style={[styles.stepLine, { backgroundColor: colors.border }, step3Reached && styles.stepLineCompleted]}
          />

          {/* Step 3: Task Completed & Impact Verified */}
          <View style={styles.stepCol}>
            <View
              style={[
                styles.stepCircle,
                { backgroundColor: colors.surface, borderColor: colors.border },
                step3Reached && styles.stepCircleCompleted,
              ]}
            >
              {step3Reached ? (
                <AppVectorIcon
                  name="trophy"
                  size={11}
                  color={colors.background}
                />
              ) : (
                <View style={[styles.stepInnerDot, { backgroundColor: colors.textSecondary }]} />
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                { color: colors.textSecondary },
                step3Reached && styles.stepLabelCompleted,
              ]}
            >
              توثيق الأثر
            </Text>
          </View>
        </View>
      )}

      {/* Meta Chips Row */}
      <View style={styles.metaChipsWrap}>
        <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <AppVectorIcon
            name="calendar"
            size={12}
            color={colors.textSecondary}
          />
          <Text style={[styles.metaChipText, { color: colors.textSecondary }]}>{formattedDate}</Text>
        </View>

        {project && Boolean(project.location) && (
          <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <AppVectorIcon
              name="location"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaChipText, { color: colors.textSecondary }]}>{project.location}</Text>
          </View>
        )}

        {project && (
          <View style={[styles.metaChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <AppVectorIcon
              name="target"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaChipText, { color: colors.textSecondary }]}>
              المشروع: {translateStatus(project.status)}
            </Text>
          </View>
        )}
      </View>

      {/* Motivation Message */}
      {Boolean(message) && (
        <View style={[styles.messageBox, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
          <Text style={[styles.messageLabel, { color: colors.textSecondary }]}>رسالتك المرفقة:</Text>
          <Text style={[styles.messageText, { color: colors.text }]} numberOfLines={2}>
            "{message}"
          </Text>
        </View>
      )}

      {/* Info Hint when ACCEPTED */}
      {isAccepted && (
        <View style={styles.acceptedHintBox}>
          <AppVectorIcon name="clock" size={14} color={colors.primary} />
          <Text style={[styles.acceptedHintText, { color: colors.text }]}>
            أنت ضمن فريق المشروع. بعد إتمام مهامك ستقوم الجمعية باعتماد ساعاتك
            ونقاط أثرك.
          </Text>
        </View>
      )}

      {/* Verified Impact Certificate Box when COMPLETED */}
      {isCompleted && (
        <View style={[styles.impactCertificateBox, { borderColor: colors.primary }]}>
          <View style={styles.impactHeaderRow}>
            <View style={styles.impactTitleCluster}>
              <View style={[styles.trophyBadge, { backgroundColor: colors.primary }]}>
                <AppVectorIcon
                  name="trophy"
                  size={14}
                  color={colors.background}
                />
              </View>
              <Text style={[styles.impactSummaryTitle, { color: colors.text }]}>
                شهادة الأثر المعتمدة من الجمعية
              </Text>
            </View>
            <View style={[styles.verifiedTag, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <AppVectorIcon name="check" size={10} color={colors.primary} />
              <Text style={[styles.verifiedTagText, { color: colors.primary }]}>موثّق</Text>
            </View>
          </View>

          {volunteerImpact ? (
            <>
              <View style={[styles.impactStatsGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.impactStatBox}>
                  <Text style={[styles.impactStatVal, { color: colors.primary }]}>
                    {volunteerImpact.hours}
                  </Text>
                  <Text style={[styles.impactStatLbl, { color: colors.textSecondary }]}>ساعة تطوع</Text>
                </View>
                <View style={[styles.impactStatDivider, { backgroundColor: colors.border }]} />
                <View style={styles.impactStatBox}>
                  <Text style={[styles.impactStatVal, { color: colors.primary }]}>
                    {volunteerImpact.activitiesCount}
                  </Text>
                  <Text style={[styles.impactStatLbl, { color: colors.textSecondary }]}>نشاط منجز</Text>
                </View>
                <View style={[styles.impactStatDivider, { backgroundColor: colors.border }]} />
                <View style={styles.impactStatBox}>
                  <Text style={[styles.impactStatVal, { color: colors.primary }]}>
                    {volunteerImpact.beneficiariesCount}
                  </Text>
                  <Text style={[styles.impactStatLbl, { color: colors.textSecondary }]}>مستفيد</Text>
                </View>
              </View>

              {Boolean(volunteerImpact.description) && (
                <Text style={[styles.impactDescText, { color: colors.textSecondary }]}>
                  تقييم الجمعية: "{volunteerImpact.description}"
                </Text>
              )}
            </>
          ) : (
            <Text style={[styles.impactDescText, { color: colors.textSecondary }]}>
              تم تأكيد إنجاز المهمة بنجاح وإضافة نقاط الأثر إلى رصيدك.
            </Text>
          )}
        </View>
      )}

      {/* Withdraw Action Footer */}
      {(isPending ||
        (isAccepted &&
          (project?.status === 'PUBLISHED' ||
            project?.status === 'IN_PROGRESS'))) && (
        <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.withdrawBtn,
              { borderColor: colors.error },
              isWithdrawing && styles.btnDisabled,
            ]}
            onPress={() => onWithdraw(id)}
            disabled={isWithdrawing}
            activeOpacity={0.8}
          >
            {isWithdrawing ? (
              <ActivityIndicator color={colors.error} size="small" />
            ) : (
              <View style={styles.withdrawInner}>
                <AppVectorIcon name="close" size={12} color={colors.error} />
                <Text style={[styles.withdrawText, { color: colors.error }]}>سحب وإلغاء الطلب</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    padding: 18,
    paddingRight: 22,
    borderWidth: 1,
    gap: 14,
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
    alignItems: 'flex-start',
    gap: 12,
  },
  titleCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  orgAndStatusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  orgPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingRight: 5,
    paddingLeft: 10,
    paddingVertical: 3.5,
    borderRadius: 20,
    borderWidth: 1,
  },
  orgAvatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgAvatarMiniText: {
    fontSize: 10.5,
    fontWeight: '900',
  },
  orgName: {
    fontSize: 12,
    fontWeight: '800',
    maxWidth: 130,
  },
  projectTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgePending: {
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
  },
  badgeAccepted: {
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 186, 102, 0.45)',
  },
  badgeCompleted: {
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.45)',
  },
  badgeRejected: {
    backgroundColor: 'rgba(255, 90, 95, 0.14)',
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
  stepperContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  stepCol: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleCompleted: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  stepInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 6,
    marginBottom: 14,
  },
  stepLineCompleted: {
    backgroundColor: '#38BDF8',
  },
  stepLabel: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  stepLabelActive: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  stepLabelCompleted: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#38BDF8',
  },
  metaChipsWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
    borderWidth: 1,
  },
  metaChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  messageBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 3,
    alignItems: 'flex-end',
    borderWidth: 1,
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
  acceptedHintBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 186, 102, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 186, 102, 0.3)',
  },
  acceptedHintText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 18,
  },
  impactCertificateBox: {
    backgroundColor: 'rgba(0, 186, 102, 0.1)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  impactHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactTitleCluster: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  trophyBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactSummaryTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  verifiedTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  verifiedTagText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  impactStatsGrid: {
    flexDirection: 'row-reverse',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  impactStatBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  impactStatVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  impactStatLbl: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  impactStatDivider: {
    width: 1,
    height: 24,
  },
  impactDescText: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  withdrawBtn: {
    backgroundColor: 'rgba(255, 90, 95, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  withdrawInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  withdrawText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
