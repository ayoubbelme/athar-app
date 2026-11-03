import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { volunteerHomeApi } from '../../api/volunteer-home.api';
import { extractErrorMessage } from '../../utils/error.util';
import { ApplicationStatus } from '../../types/volunteer-home.types';
import { VolunteerApplicationItem } from '../../types/requests.types';
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { RequestStatusCard } from '../../components/requests/RequestStatusCard';
import { RequestsListSkeleton } from '../../components/common/AppSkeleton';

const STATUS_FILTERS: Array<{
  label: string;
  value: ApplicationStatus | 'ALL';
  icon: string;
}> = [
  { label: 'الكل', value: 'ALL', icon: '📋' },
  { label: 'قيد المراجعة', value: 'PENDING', icon: '⏳' },
  { label: 'مقبول', value: 'ACCEPTED', icon: '✅' },
  { label: 'مكتمل', value: 'COMPLETED', icon: '🌟' },
  { label: 'مرفوض', value: 'REJECTED', icon: '❌' },
  { label: 'ملغى', value: 'WITHDRAWN', icon: '↩️' },
];

export const RequestsContainer: React.FC = () => {
  const [applications, setApplications] = useState<VolunteerApplicationItem[]>(
    [],
  );
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'ALL'>(
    'ALL',
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setErrorMsg(null);

    try {
      const res = await volunteerHomeApi.getMyApplications(100);
      const list = (
        Array.isArray(res?.data) ? res.data : []
      ) as VolunteerApplicationItem[];
      setApplications(list);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchApplications(false);
    }, [fetchApplications]),
  );

  const handleWithdraw = async (applicationId: string) => {
    Alert.alert(
      'تأكيد الإلغاء',
      'هل أنت متأكد من رغبتك في إلغاء طلب التطوع لهذا المشروع؟',
      [
        { text: 'تراجع', style: 'cancel' },
        {
          text: 'نعم، إلغاء الطلب',
          style: 'destructive',
          onPress: async () => {
            setWithdrawingId(applicationId);
            setErrorMsg(null);
            try {
              await volunteerHomeApi.withdrawApplication(applicationId);
              Alert.alert('تم الإلغاء', 'تم سحب طلب التطوع بنجاح.');
              await fetchApplications(true);
            } catch (err) {
              setErrorMsg(extractErrorMessage(err));
            } finally {
              setWithdrawingId(null);
            }
          },
        },
      ],
    );
  };

  const filteredApplications = (applications ?? []).filter((app) => {
    if (!app) return false;
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerContent}>
          <View style={styles.headerIconWrap}>
            <Text style={styles.headerIcon}>📋</Text>
          </View>
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>طلبات التطوع</Text>
            <Text style={styles.subtitle}>
              تابع حالة طلباتك والساعات المعتمدة بعد إتمام مهامك
            </Text>
          </View>
        </View>
        {filteredApplications.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{filteredApplications.length}</Text>
          </View>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRowContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          data={STATUS_FILTERS}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isSelected = filterStatus === item.value;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setFilterStatus(item.value)}
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
  <RequestsListSkeleton />
) : (
        <FlatList
          data={filteredApplications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RequestStatusCard
              item={item}
              onWithdraw={handleWithdraw}
              withdrawingId={withdrawingId}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchApplications(true)}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🗂️</Text>
              <Text style={styles.emptyTitle}>لا توجد طلبات حالياً</Text>
              <Text style={styles.emptySubtitle}>
                تصفح الفرص التطوعية وقدم على المشاريع المناسبة لمهاراتك.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 4,
    position: 'relative',
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
  countBadge: {
    position: 'absolute',
    bottom: 14,
    left: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    minWidth: 28,
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.background,
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
});