import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { organizationApi } from '../../api/organization.api';
import { extractErrorMessage } from '../../utils/error.util';
import { ApplicationStatus } from '../../types/volunteer-home.types';
import { OrganizationApplicationItem } from '../../types/organization.types';
import { useTheme } from '../../context/ThemeContext';
import { ThemePalette } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { RequestsListSkeleton } from '../../components/common/AppSkeleton';
import { AppVectorIcon } from '../../components/common/AppVectorIcon';
import { OrgApplicantCard } from '../../components/organization/OrgApplicantCard';

const STATUS_FILTERS: Array<{
  label: string;
  value: ApplicationStatus | 'ALL';
}> = [
  { label: 'الكل', value: 'ALL' },
  { label: 'بانتظار المراجعة', value: 'PENDING' },
  { label: 'المقبولون', value: 'ACCEPTED' },
  { label: 'المكتملون', value: 'COMPLETED' },
  { label: 'المرفوضون', value: 'REJECTED' },
];

export const OrgRequestsContainer: React.FC = () => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const route = useRoute<any>();
  const filterProjectId: string | undefined = route.params?.projectId;
  const filterProjectTitle: string | undefined = route.params?.projectTitle;

  const [requests, setRequests] = useState<OrganizationApplicationItem[]>([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<
    string | null
  >(filterProjectId ?? null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>(
    'ALL',
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Organization Impact & Completion Modal State
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [targetApp, setTargetApp] =
    useState<OrganizationApplicationItem | null>(null);
  const [hoursInput, setHoursInput] = useState('6');
  const [activitiesInput, setActivitiesInput] = useState('1');
  const [beneficiariesInput, setBeneficiariesInput] = useState('15');
  const [resourcesInput, setResourcesInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [submittingCompletion, setSubmittingCompletion] = useState(false);

  useEffect(() => {
    if (filterProjectId) {
      setSelectedProjectFilter(filterProjectId);
    }
  }, [filterProjectId]);

  const fetchIncomingRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const list = await organizationApi.getAllIncomingRequests();
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  const handleDecision = (
    applicationId: string,
    decision: 'ACCEPTED' | 'REJECTED',
  ) => {
    const isAccept = decision === 'ACCEPTED';
    Alert.alert(
      isAccept ? 'تأكيد قبول المتطوع' : 'تأكيد رفض الطلب',
      isAccept
        ? 'هل تريد قبول هذا المتطوع للانضمام إلى الفرصة التطوعية؟'
        : 'هل أنت متأكد من الاعتذار عن قبول هذا الطلب؟',
      [
        { text: 'تراجع', style: 'cancel' },
        {
          text: isAccept ? 'نعم، قبول' : 'نعم، رفض',
          style: isAccept ? 'default' : 'destructive',
          onPress: async () => {
            setProcessingId(applicationId);
            setErrorMsg(null);
            try {
              const updated = await organizationApi.updateApplicationStatus(
                applicationId,
                decision,
              );
              setRequests((prev) =>
                prev.map((r) =>
                  r.id === applicationId
                    ? { ...r, status: updated?.status ?? decision }
                    : r,
                ),
              );
              Alert.alert(
                isAccept ? 'تم القبول بنجاح' : 'تم تحديث الحالة',
                isAccept
                  ? 'تم قبول المتطوع وإضافته إلى فريق المشروع.'
                  : 'تم تحديث حالة الطلب إلى مرفوض.',
              );
            } catch (err) {
              setErrorMsg(extractErrorMessage(err));
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  };

  const handleOpenCompleteModal = (item: OrganizationApplicationItem) => {
    setTargetApp(item);
    const existing = item.volunteerImpact;
    if (existing) {
      setHoursInput(String(existing.hours));
      setActivitiesInput(String(existing.activitiesCount));
      setBeneficiariesInput(String(existing.beneficiariesCount));
      setResourcesInput(existing.resources ?? '');
      setDescriptionInput(existing.description ?? '');
    } else {
      setHoursInput('6');
      setActivitiesInput('1');
      setBeneficiariesInput('15');
      setResourcesInput('');
      setDescriptionInput('');
    }
    setCompleteModalVisible(true);
  };

  const handleConfirmTaskAndImpact = async () => {
    if (!targetApp) return;

    const parsedHours = parseFloat(hoursInput);
    if (Number.isNaN(parsedHours) || parsedHours < 0) {
      Alert.alert('تنبيه', 'يرجى إدخال عدد ساعات صحيح للمتطوع.');
      return;
    }

    const parsedActivities = Math.max(
      0,
      parseInt(activitiesInput || '0', 10) || 0,
    );
    const parsedBeneficiaries = Math.max(
      0,
      parseInt(beneficiariesInput || '0', 10) || 0,
    );

    setSubmittingCompletion(true);
    setErrorMsg(null);

    try {
      const updated = await organizationApi.updateApplicationStatus(
        targetApp.id,
        'COMPLETED',
        {
          hours: parsedHours,
          activitiesCount: parsedActivities,
          beneficiariesCount: parsedBeneficiaries,
          resources: resourcesInput.trim() || undefined,
          description: descriptionInput.trim() || undefined,
        },
      );

      setRequests((prev) =>
        prev.map((r) =>
          r.id === targetApp.id
            ? {
                ...r,
                status: 'COMPLETED',
                volunteerImpact: updated?.volunteerImpact ?? {
                  hours: parsedHours,
                  activitiesCount: parsedActivities,
                  beneficiariesCount: parsedBeneficiaries,
                  resources: resourcesInput.trim() || null,
                  description: descriptionInput.trim() || null,
                },
              }
            : r,
        ),
      );

      setCompleteModalVisible(false);
      Alert.alert(
        'تم اعتماد إنجاز المهمة والأثر',
        `تم منح المتطوع ${parsedHours} ساعة تطوعية وتحديث نقاط أثره بنجاح.`,
      );
    } catch (err) {
      Alert.alert('خطأ', extractErrorMessage(err));
    } finally {
      setSubmittingCompletion(false);
    }
  };

  const projectScopedRequests = useMemo(
    () =>
      (requests ?? []).filter((req) => {
        if (!req) return false;
        if (
          selectedProjectFilter &&
          req.project?.id !== selectedProjectFilter
        ) {
          return false;
        }
        return true;
      }),
    [requests, selectedProjectFilter],
  );

  const counts = useMemo(() => {
    return {
      ALL: projectScopedRequests.length,
      PENDING: projectScopedRequests.filter((r) => r.status === 'PENDING')
        .length,
      ACCEPTED: projectScopedRequests.filter((r) => r.status === 'ACCEPTED')
        .length,
      COMPLETED: projectScopedRequests.filter((r) => r.status === 'COMPLETED')
        .length,
      REJECTED: projectScopedRequests.filter((r) => r.status === 'REJECTED')
        .length,
      WITHDRAWN: projectScopedRequests.filter((r) => r.status === 'WITHDRAWN')
        .length,
    };
  }, [projectScopedRequests]);

  const filteredRequests = useMemo(
    () =>
      projectScopedRequests.filter((req) => {
        if (statusFilter !== 'ALL' && req.status !== statusFilter) {
          return false;
        }
        return true;
      }),
    [projectScopedRequests, statusFilter],
  );

  const targetVolunteerName =
    targetApp?.volunteer?.name ?? targetApp?.user?.name ?? 'المتطوع';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Top Summary Section */}
      <View style={styles.header}>
        <Text style={styles.title}>إدارة المتقدمين واعتماد الأثر</Text>
        <Text style={styles.subtitle}>
          اقبل المتطوعين، وعند إتمام مهامهم حدّد الساعات والأثر المعتمد لكل متطوع
        </Text>

        {selectedProjectFilter && (
          <View style={styles.projectFilterBanner}>
            <TouchableOpacity
              onPress={() => setSelectedProjectFilter(null)}
              style={styles.clearProjectFilterBtn}
            >
              <AppVectorIcon name="close" size={12} color={colors.text} />
              <Text style={styles.clearProjectFilterText}>عرض الكل</Text>
            </TouchableOpacity>
            <Text style={styles.projectFilterText} numberOfLines={1}>
              تصفية حسب: {filterProjectTitle ?? 'مشروع محدد'}
            </Text>
          </View>
        )}

        {/* 4-Card KPI Summary Row */}
        <View style={styles.kpiRow}>
          <TouchableOpacity
            style={[
              styles.kpiCard,
              statusFilter === 'ALL' && styles.kpiCardActive,
            ]}
            onPress={() => setStatusFilter('ALL')}
            activeOpacity={0.85}
          >
            <Text style={styles.kpiValue}>{counts.ALL}</Text>
            <Text style={styles.kpiLabel}>الكل</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.kpiCard,
              statusFilter === 'PENDING' && styles.kpiCardPending,
            ]}
            onPress={() => setStatusFilter('PENDING')}
            activeOpacity={0.85}
          >
            <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>
              {counts.PENDING}
            </Text>
            <Text style={styles.kpiLabel}>بانتظار القرار</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.kpiCard,
              statusFilter === 'ACCEPTED' && styles.kpiCardActive,
            ]}
            onPress={() => setStatusFilter('ACCEPTED')}
            activeOpacity={0.85}
          >
            <Text style={[styles.kpiValue, { color: colors.primary }]}>
              {counts.ACCEPTED}
            </Text>
            <Text style={styles.kpiLabel}>مقبولون</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.kpiCard,
              statusFilter === 'COMPLETED' && styles.kpiCardCompleted,
            ]}
            onPress={() => setStatusFilter('COMPLETED')}
            activeOpacity={0.85}
          >
            <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>
              {counts.COMPLETED}
            </Text>
            <Text style={styles.kpiLabel}>مكتملون</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Filter Chips */}
      <View style={styles.filterRowContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          data={STATUS_FILTERS}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isSelected = statusFilter === item.value;
            const countVal = counts[item.value] ?? 0;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setStatusFilter(item.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.filterCountBadge,
                    isSelected && styles.filterCountBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterCountText,
                      isSelected && styles.filterCountTextActive,
                    ]}
                  >
                    {countVal}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.errorWrapper}>
        <ErrorBanner message={errorMsg} />
      </View>

      {loading ? (
        <RequestsListSkeleton />
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <OrgApplicantCard
              item={item}
              processingId={processingId}
              onDecision={handleDecision}
              onOpenCompleteModal={handleOpenCompleteModal}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchIncomingRequests(true)}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <AppVectorIcon name="users" size={24} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                لا توجد طلبات متطوعين في هذا التصنيف
              </Text>
              <Text style={styles.emptySubtitle}>
                ستظهر هنا طلبات المتطوعين فور تقديمهم على الفرص التي تنشرها
                جمعيتك.
              </Text>
            </View>
          }
        />
      )}

      {/* Organization Modal to Confirm Task Completion & Award Verified Impact */}
      <Modal
        visible={completeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCompleteModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setCompleteModalVisible(false)}
              >
                <AppVectorIcon
                  name="close"
                  size={13}
                  color={colors.textSecondary}
                />
                <Text style={styles.closeBtnText}>إغلاق</Text>
              </TouchableOpacity>
              <View style={styles.modalTitleRow}>
                <AppVectorIcon name="trophy" size={18} color={colors.primary} />
                <Text style={styles.modalTitle}>
                  اعتماد إتمام المهمة والأثر
                </Text>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              {targetApp && (
                <View style={styles.volunteerSummaryBanner}>
                  <Text style={styles.volunteerSummaryName}>
                    المتطوع: {targetVolunteerName}
                  </Text>
                  <Text style={styles.volunteerSummaryProject}>
                    الفرصة: {targetApp.project?.title}
                  </Text>
                </View>
              )}

              <Text style={styles.inputLabel}>
                عدد الساعات المعتمدة للمتطوع *
              </Text>
              <TextInput
                style={styles.input}
                value={hoursInput}
                onChangeText={setHoursInput}
                keyboardType="decimal-pad"
                placeholder="مثال: 6"
                placeholderTextColor={colors.textSecondary}
                textAlign="right"
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInputCol}>
                  <Text style={styles.inputLabel}>الأنشطة المنجزة</Text>
                  <TextInput
                    style={styles.input}
                    value={activitiesInput}
                    onChangeText={setActivitiesInput}
                    keyboardType="number-pad"
                    placeholder="1"
                    placeholderTextColor={colors.textSecondary}
                    textAlign="right"
                  />
                </View>

                <View style={styles.halfInputCol}>
                  <Text style={styles.inputLabel}>عدد المستفيدين</Text>
                  <TextInput
                    style={styles.input}
                    value={beneficiariesInput}
                    onChangeText={setBeneficiariesInput}
                    keyboardType="number-pad"
                    placeholder="15"
                    placeholderTextColor={colors.textSecondary}
                    textAlign="right"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>
                الموارد المستخدمة (اختياري)
              </Text>
              <TextInput
                style={styles.input}
                value={resourcesInput}
                onChangeText={setResourcesInput}
                placeholder="مثال: معدات طبية، مطويات توعوية..."
                placeholderTextColor={colors.textSecondary}
                textAlign="right"
              />

              <Text style={styles.inputLabel}>
                ملاحظات الجمعية وتوثيق الأثر (اختياري)
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={descriptionInput}
                onChangeText={setDescriptionInput}
                placeholder="تقييم أداء المتطوع والنتائج التي ساهم في تحقيقها..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                textAlign="right"
              />

              <TouchableOpacity
                style={[
                  styles.confirmImpactBtn,
                  submittingCompletion && styles.btnDisabled,
                ]}
                onPress={handleConfirmTaskAndImpact}
                disabled={submittingCompletion}
                activeOpacity={0.85}
              >
                {submittingCompletion ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <View style={styles.confirmBtnInner}>
                    <AppVectorIcon
                      name="check"
                      size={15}
                      color={colors.white}
                    />
                    <Text style={styles.confirmImpactBtnText}>
                      تأكيد الإنجاز واعتماد الساعات للمتطوع
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  projectFilterBanner: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  projectFilterText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'right',
  },
  clearProjectFilterBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  clearProjectFilterText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  kpiRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    gap: 8,
    marginTop: 4,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 2,
  },
  kpiCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.1)',
  },
  kpiCardPending: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  kpiCardCompleted: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  kpiLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filterRowContainer: {
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.background,
  },
  filterCountBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  filterCountBadgeActive: {
    backgroundColor: 'rgba(11, 19, 16, 0.22)',
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.text,
  },
  filterCountTextActive: {
    color: colors.background,
  },
  errorWrapper: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
    gap: 14,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 26,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '88%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    
    borderColor: colors.primary,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: colors.text,
  },
  closeBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalBody: {
    padding: 20,
    gap: 12,
    paddingBottom: 36,
  },
  volunteerSummaryBanner: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 12,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 4,
  },
  volunteerSummaryName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'right',
  },
  volunteerSummaryProject: {
    fontSize: 12.5,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'right',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  input: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.text,
    writingDirection: 'rtl',
  },
  textArea: {
    minHeight: 84,
  },
  rowInputs: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  halfInputCol: {
    flex: 1,
    gap: 6,
  },
  confirmImpactBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  confirmBtnInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  confirmImpactBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});