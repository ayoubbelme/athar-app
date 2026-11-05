import React, { useCallback, useMemo, useState } from 'react';
import {
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { volunteerHomeApi } from '../../api/volunteer-home.api';
import { extractErrorMessage } from '../../utils/error.util';
import { ApplicationStatus } from '../../types/volunteer-home.types';
import { VolunteerApplicationItem } from '../../types/requests.types';
import { useTheme } from '../../context/ThemeContext';
import { ThemePalette } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { RequestsListSkeleton } from '../../components/common/AppSkeleton';
import { AppVectorIcon } from '../../components/common/AppVectorIcon';
import { RequestStatusCard } from '../../components/requests/RequestStatusCard';

const STATUS_FILTERS: Array<{
  label: string;
  value: ApplicationStatus | 'ALL';
}> = [
  { label: 'الكل', value: 'ALL' },
  { label: 'قيد المراجعة', value: 'PENDING' },
  { label: 'مقبول', value: 'ACCEPTED' },
  { label: 'مكتمل وموثّق', value: 'COMPLETED' },
  { label: 'مرفوض', value: 'REJECTED' },
  { label: 'ملغى', value: 'WITHDRAWN' },
];

export const RequestsContainer: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

  const counts = useMemo(() => {
    const safe = applications ?? [];
    return {
      ALL: safe.length,
      PENDING: safe.filter((a) => a?.status === 'PENDING').length,
      ACCEPTED: safe.filter((a) => a?.status === 'ACCEPTED').length,
      COMPLETED: safe.filter((a) => a?.status === 'COMPLETED').length,
      REJECTED: safe.filter((a) => a?.status === 'REJECTED').length,
      WITHDRAWN: safe.filter((a) => a?.status === 'WITHDRAWN').length,
    };
  }, [applications]);

  const filteredApplications = useMemo(
    () =>
      (applications ?? []).filter((app) => {
        if (!app) return false;
        if (filterStatus === 'ALL') return true;
        return app.status === filterStatus;
      }),
    [applications, filterStatus],
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Top Summary Header Card */}
      <View style={styles.topSection}>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>سجل طلبات التطوع والأثر</Text>
          <Text style={styles.subtitle}>
            تابع مراحل قبولك في الفرص التطوعية وشهادات الساعات المعتمدة من الجمعيات
          </Text>
        </View>

        {/* 4-Metric KPI Strip */}
        <View style={styles.kpiRow}>
          <TouchableOpacity
            style={[
              styles.kpiCard,
              filterStatus === 'ALL' && styles.kpiCardActive,
            ]}
            onPress={() => setFilterStatus('ALL')}
            activeOpacity={0.85}
          >
            <Text style={styles.kpiValue}>{counts.ALL}</Text>
            <Text style={styles.kpiLabel}>إجمالي الطلبات</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.kpiCard,
              filterStatus === 'PENDING' && styles.kpiCardPending,
            ]}
            onPress={() => setFilterStatus('PENDING')}
            activeOpacity={0.85}
          >
            <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>
              {counts.PENDING}
            </Text>
            <Text style={styles.kpiLabel}>قيد المراجعة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.kpiCard,
              filterStatus === 'ACCEPTED' && styles.kpiCardActive,
            ]}
            onPress={() => setFilterStatus('ACCEPTED')}
            activeOpacity={0.85}
          >
            <Text style={[styles.kpiValue, { color: colors.primary }]}>
              {counts.ACCEPTED}
            </Text>
            <Text style={styles.kpiLabel}>تم القبول</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.kpiCard,
              filterStatus === 'COMPLETED' && styles.kpiCardCompleted,
            ]}
            onPress={() => setFilterStatus('COMPLETED')}
            activeOpacity={0.85}
          >
            <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>
              {counts.COMPLETED}
            </Text>
            <Text style={styles.kpiLabel}>مهام مكتملة</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Filter Chips with Counts */}
      <View style={styles.filterRowContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          data={STATUS_FILTERS}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isSelected = filterStatus === item.value;
            const countVal = counts[item.value] ?? 0;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setFilterStatus(item.value)}
                activeOpacity={0.85}
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
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <AppVectorIcon
                  name="target"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>
                لا توجد طلبات تطوع في هذا التصنيف
              </Text>
              <Text style={styles.emptySubtitle}>
                استكشف الفرص التطوعية المتاحة وقدّم على المبادرات التي تناسب
                مهاراتك واهتماماتك.
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('ChancesTab')}
                activeOpacity={0.85}
              >
                <AppVectorIcon
                  name="search"
                  size={15}
                  color={colors.white}
                />
                <Text style={styles.exploreBtnText}>
                  تصفح الفرص التطوعية المتاحة
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 14,
  },
  headerTextCol: {
    alignItems: 'flex-end',
    gap: 3,
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
    lineHeight: 18,
  },
  kpiRow: {
    flexDirection: 'row-reverse',
    gap: 8,
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
    fontSize: 16.5,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  exploreBtnText: {
    color: colors.background,
    fontSize: 13.5,
    fontWeight: '900',
  },
});