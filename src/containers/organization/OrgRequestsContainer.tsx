import React, { useCallback, useEffect, useState } from 'react';
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
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { OrgApplicantCard } from '../../components/organization/OrgApplicantCard';

const STATUS_FILTERS: Array<{
  label: string;
  value: ApplicationStatus | 'ALL';
  icon: string;
}> = [
  { label: 'الكل', value: 'ALL', icon: '📋' },
  { label: 'بانتظار المراجعة', value: 'PENDING', icon: '⏳' },
  { label: 'المقبولون', value: 'ACCEPTED', icon: '✅' },
  { label: 'المكتملون', value: 'COMPLETED', icon: '🌟' },
  { label: 'المرفوضون', value: 'REJECTED', icon: '❌' },
];

export const OrgRequestsContainer: React.FC = () => {
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
                isAccept ? 'تم القبول بنجاح ✅' : 'تم تحديث الحالة',
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
        'تم اعتماد إنجاز المهمة والأثر 🏆',
        `تم منح المتطوع ${parsedHours} ساعة تطوعية وتحديث نقاط أثره بنجاح.`,
      );
    } catch (err) {
      Alert.alert('خطأ', extractErrorMessage(err));
    } finally {
      setSubmittingCompletion(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (!req) return false;
    if (
      selectedProjectFilter &&
      req.project?.id !== selectedProjectFilter
    ) {
      return false;
    }
    if (statusFilter !== 'ALL' && req.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const targetVolunteerName =
    targetApp?.volunteer?.name ?? targetApp?.user?.name ?? 'المتطوع';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerContent}>
          <View style={styles.headerIconWrap}>
            <Text style={styles.headerIcon}>🏛</Text>
          </View>
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>طلبات المتطوعين</Text>
            <Text style={styles.subtitle}>
              اقبل المتطوعين وحدّد الساعات والأثر المعتمد لكل منهم
            </Text>
          </View>
        </View>

        {selectedProjectFilter && (
          <View style={styles.projectFilterBanner}>
            <TouchableOpacity
              onPress={() => setSelectedProjectFilter(null)}
              style={styles.clearProjectFilterBtn}
            >
              <Text style={styles.clearProjectFilterText}>✕ عرض الكل</Text>
            </TouchableOpacity>
            <Text style={styles.projectFilterText} numberOfLines={1}>
              📌 {filterProjectTitle ?? 'مشروع محدد'}
            </Text>
          </View>
        )}
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
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setStatusFilter(item.value)}
                activeOpacity={0.75}
              >
                <Text style={styles.filterChipIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.errorWrapper}>
        <ErrorBanner message={errorMsg} />
      </View>

      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>جارٍ تحميل الطلبات...</Text>
        </View>
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
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>
                لا توجد طلبات مطابقة حالياً
              </Text>
              <Text style={styles.emptySubtitle}>
                ستظهر هنا طلبات المتطوعين فور تقديمهم على الفرص التي تنشرها جمعيتك.
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
                <Text style={styles.closeBtnText}>إغلاق ✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                اعتماد إتمام المهمة والأثر 🏆
              </Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              {targetApp && (
                <View style={styles.volunteerSummaryBanner}>
                  <Text style={styles.volunteerSummaryName}>
                    👤 المتطوع: {targetVolunteerName}
                  </Text>
                  <Text style={styles.volunteerSummaryProject}>
                    📌 الفرصة: {targetApp.project?.title}
                  </Text>
                </View>
              )}

              <Text style={styles.inputLabel}>
                ⏱️ عدد الساعات المعتمدة للمتطوع *
              </Text>
              <TextInput
                style={styles.input}
                value={hoursInput}
                onChangeText={setHoursInput}
                keyboardType="decimal-pad"
                placeholder="مثال: 6"
                placeholderTextColor={COLORS.textSecondary}
                textAlign="right"
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInputCol}>
                  <Text style={styles.inputLabel}>⚡ الأنشطة المنجزة</Text>
                  <TextInput
                    style={styles.input}
                    value={activitiesInput}
                    onChangeText={setActivitiesInput}
                    keyboardType="number-pad"
                    placeholder="1"
                    placeholderTextColor={COLORS.textSecondary}
                    textAlign="right"
                  />
                </View>

                <View style={styles.halfInputCol}>
                  <Text style={styles.inputLabel}>👥 عدد المستفيدين</Text>
                  <TextInput
                    style={styles.input}
                    value={beneficiariesInput}
                    onChangeText={setBeneficiariesInput}
                    keyboardType="number-pad"
                    placeholder="15"
                    placeholderTextColor={COLORS.textSecondary}
                    textAlign="right"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>
                🧰 الموارد المستخدمة (اختياري)
              </Text>
              <TextInput
                style={styles.input}
                value={resourcesInput}
                onChangeText={setResourcesInput}
                placeholder="مثال: معدات طبية، مطويات توعوية..."
                placeholderTextColor={COLORS.textSecondary}
                textAlign="right"
              />

              <Text style={styles.inputLabel}>
                📝 ملاحظات الجمعية وتوثيق الأثر (اختياري)
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={descriptionInput}
                onChangeText={setDescriptionInput}
                placeholder="تقييم أداء المتطوع والنتائج التي ساهم في تحقيقها..."
                placeholderTextColor={COLORS.textSecondary}
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
                  <ActivityIndicator color={COLORS.background} size="small" />
                ) : (
                  <Text style={styles.confirmImpactBtnText}>
                    تأكيد الإنجاز واعتماد الساعات للمتطوع ✅
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 4,
    position: 'relative',
    gap: 10,
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    opacity: 0.9,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  headerIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 186, 102, 0.13)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 186, 102, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { fontSize: 22 },
  headerTextBlock: { flex: 1, alignItems: 'flex-end', gap: 3 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 18,
  },
  projectFilterBanner: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  projectFilterText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'right',
  },
  clearProjectFilterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearProjectFilterText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },

  // ── Filter chips ─────────────────────────────────────────────────────────
  filterRowContainer: { marginBottom: 8 },
  filterScroll: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 22,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipIcon: { fontSize: 12 },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: { color: COLORS.background },

  // ── Misc ─────────────────────────────────────────────────────────────────
  errorWrapper: { paddingHorizontal: 20 },
  loaderBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loaderText: { fontSize: 13, color: COLORS.textSecondary },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 36,
    gap: 12,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: 4,
    gap: 10,
  },
  emptyIcon: { fontSize: 40 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Modal ─────────────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '88%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 2,
    borderColor: COLORS.primary,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  closeBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  modalBody: {
    padding: 20,
    gap: 12,
    paddingBottom: 36,
  },
  volunteerSummaryBanner: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 5,
  },
  volunteerSummaryName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'right',
  },
  volunteerSummaryProject: {
    fontSize: 12.5,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'right',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.text,
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
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  confirmImpactBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});