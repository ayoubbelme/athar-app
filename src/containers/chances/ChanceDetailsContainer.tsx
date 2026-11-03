import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../navigation/types';
import { volunteerHomeApi } from '../../api/volunteer-home.api';
import { extractErrorMessage } from '../../utils/error.util';
import {
  translateAvailability,
  translateCategory,
  translateStatus,
} from '../../utils/arabic.util';
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { MatchDonutChart } from '../../components/common/MatchDonutChart';

type DetailsRouteProp = RouteProp<AppStackParamList, 'ChanceDetails'>;

function formatArabicDate(iso: string | null | undefined): string {
  if (!iso) return 'غير محدد';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export const ChanceDetailsContainer: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailsRouteProp>();
  const { project, match, matchScore, alreadyApplied: initialApplied } =
    route.params;

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(Boolean(initialApplied));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const effectiveScore = match?.score ?? matchScore ?? null;
  const isOpen = project.status === 'PUBLISHED';
  const isFull =
    project.maxVolunteers !== null &&
    project.acceptedVolunteers >= project.maxVolunteers;
  const canApply = isOpen && !isFull && !applied;

  const matchedSkills = Array.isArray(match?.matchedSkills)
    ? match!.matchedSkills
    : [];
  const missingSkills = Array.isArray(match?.missingSkills)
    ? match!.missingSkills
    : [];
  const projectSkills = Array.isArray(project.skills) ? project.skills : [];
  const availabilities = Array.isArray(project.availability)
    ? project.availability
    : [];

  const handleApply = async () => {
    setApplying(true);
    setErrorMsg(null);
    try {
      await volunteerHomeApi.applyToProject(project.id);
      setApplied(true);
      Alert.alert(
        'تم إرسال طلبك بنجاح! 🎉',
        'تم إرسال طلب التطوع الخاص بك إلى الجمعية للمراجعة.',
      );
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setApplying(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" />

      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>تفاصيل الفرصة التطوعية</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ErrorBanner message={errorMsg} />

        {/* Hero Title & Organization Card with Match Donut Chart */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroInfoCol}>
              <View style={styles.badgesRow}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {translateStatus(project.status)}
                  </Text>
                </View>
                {project.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {translateCategory(project.category)}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.orgName}>
                🏛️ الجمعية المنظمة: {project.organization?.name ?? 'جمعية'}
              </Text>
            </View>

            {effectiveScore !== null && (
              <MatchDonutChart
                score={effectiveScore}
                size={76}
                strokeWidth={7}
                label="نسبة التوافق"
              />
            )}
          </View>
        </View>

        {/* Full Description Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>الوصف الكامل للمشروع</Text>
          <Text style={styles.fullDescription}>{project.description}</Text>
        </View>

        {/* Project Logistics & Schedule Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>معلومات التوقيت والموقع</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📍 الموقع</Text>
              <Text style={styles.infoValue}>
                {project.location || 'عن بُعد / مرن'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>👥 المقاعد المتاحة</Text>
              <Text style={styles.infoValue}>
                {project.maxVolunteers !== null
                  ? `${project.acceptedVolunteers} من ${project.maxVolunteers} متطوع`
                  : `${project.acceptedVolunteers} متطوع مقبول`}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📅 تاريخ البداية</Text>
              <Text style={styles.infoValue}>
                {formatArabicDate(project.startDate)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>🏁 تاريخ النهاية</Text>
              <Text style={styles.infoValue}>
                {formatArabicDate(project.endDate)}
              </Text>
            </View>
          </View>

          {availabilities.length > 0 && (
            <View style={styles.availabilityRow}>
              <Text style={styles.infoLabel}>🕒 أوقات التطوع المطلوبة:</Text>
              <View style={styles.chipsWrap}>
                {availabilities.map((av) => (
                  <View key={av} style={styles.availChip}>
                    <Text style={styles.availChipText}>
                      {translateAvailability(av)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Skills Breakdown Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>المهارات المطلوبة للفرصة</Text>

          {matchedSkills.length > 0 || missingSkills.length > 0 ? (
            <View style={styles.skillsGroup}>
              {matchedSkills.length > 0 && (
                <View style={styles.skillSubGroup}>
                  <Text style={styles.subGroupTitle}>
                    مهارات متوفرة لديك ({matchedSkills.length}):
                  </Text>
                  <View style={styles.chipsWrap}>
                    {matchedSkills.map((s) => (
                      <View key={s.skillId} style={styles.matchedSkillChip}>
                        <Text style={styles.matchedSkillText}>✓ {s.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {missingSkills.length > 0 && (
                <View style={styles.skillSubGroup}>
                  <Text style={styles.subGroupTitle}>
                    مهارات إضافية مطلوبة ({missingSkills.length}):
                  </Text>
                  <View style={styles.chipsWrap}>
                    {missingSkills.map((s) => (
                      <View key={s.skillId} style={styles.missingSkillChip}>
                        <Text style={styles.missingSkillText}>{s.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ) : projectSkills.length > 0 ? (
            <View style={styles.chipsWrap}>
              {projectSkills.map((req) => (
                <View key={req.skill.id} style={styles.matchedSkillChip}>
                  <Text style={styles.matchedSkillText}>{req.skill.name}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptySkillsText}>
              لا توجد مهارات خاصة محددة — الفرصة مفتوحة لجميع المتطوعين.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Apply Bar */}
      <View style={styles.bottomBar}>
        {applied ? (
          <View style={styles.appliedBanner}>
            <Text style={styles.appliedBannerText}>
              ✓ تم إرسال طلب التطوع لهذه الفرصة
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.applyButton,
              (!canApply || applying) && styles.applyButtonDisabled,
            ]}
            onPress={handleApply}
            disabled={!canApply || applying}
            activeOpacity={0.85}
          >
            {applying ? (
              <ActivityIndicator color={COLORS.background} size="small" />
            ) : (
              <Text style={styles.applyButtonText}>
                {isFull
                  ? 'اكتمل العدد الأقصى للمتطوعين'
                  : isOpen
                  ? 'قدّم على هذه الفرصة التطوعية الآن'
                  : 'التقديم مغلق حالياً'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topNav: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnText: {
    color: COLORS.text,
    fontSize: 13.5,
    fontWeight: '700',
  },
  navTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  navSpacer: {
    width: 68,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  heroTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },
  heroInfoCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  badgesRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 28,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  orgName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    alignItems: 'flex-end',
  },
  sectionHeader: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  fullDescription: {
    fontSize: 14.5,
    color: COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  infoGrid: {
    width: '100%',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoItem: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-end',
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  availabilityRow: {
    width: '100%',
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 4,
  },
  chipsWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  availChip: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  availChipText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  skillsGroup: {
    width: '100%',
    gap: 12,
    alignItems: 'flex-end',
  },
  skillSubGroup: {
    width: '100%',
    alignItems: 'flex-end',
    gap: 6,
  },
  subGroupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  matchedSkillChip: {
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  matchedSkillText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  missingSkillChip: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  missingSkillText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  emptySkillsText: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.65,
  },
  applyButtonText: {
    color: COLORS.background,
    fontSize: 15.5,
    fontWeight: '800',
  },
  appliedBanner: {
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  appliedBannerText: {
    color: COLORS.primary,
    fontSize: 14.5,
    fontWeight: '800',
  },
});