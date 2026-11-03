import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { organizationApi } from '../../api/organization.api';
import { extractErrorMessage } from '../../utils/error.util';
import { ProjectItem, ProjectStatus } from '../../types/volunteer-home.types';
import {
  OrganizationApplicationItem,
  OrganizationDashboardStats,
} from '../../types/organization.types';
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { HomeTopHeader } from '../../components/home/HomeTopHeader';
import { OrgStatsRow } from '../../components/organization/OrgStatsRow';
import { OrgProjectCard } from '../../components/organization/OrgProjectCard';

export const OrgHomeContainer: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [pendingByProject, setPendingByProject] = useState<
    Record<string, number>
  >({});
  const [stats, setStats] = useState<OrganizationDashboardStats>({
    totalChancesCount: 0,
    openChancesCount: 0,
    pendingRequestsCount: 0,
    acceptedVolunteersCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadOrgDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const [myProjects, allRequests] = await Promise.all([
        organizationApi.getMyProjects(50),
        organizationApi.getAllIncomingRequests().catch(
          () => [] as OrganizationApplicationItem[],
        ),
      ]);

      const safeProjects = Array.isArray(myProjects) ? myProjects : [];
      const safeRequests = Array.isArray(allRequests) ? allRequests : [];

      setProjects(safeProjects);

      const pendingMap: Record<string, number> = {};
      let totalPending = 0;

      safeRequests.forEach((req) => {
        if (req?.status === 'PENDING') {
          totalPending += 1;
          const pid = req.project?.id;
          if (pid) {
            pendingMap[pid] = (pendingMap[pid] ?? 0) + 1;
          }
        }
      });

      setPendingByProject(pendingMap);

      const openCount = safeProjects.filter(
        (p) => p.status === 'PUBLISHED',
      ).length;
      const acceptedTotal = safeProjects.reduce(
        (acc, p) => acc + (p.acceptedVolunteers ?? 0),
        0,
      );

      setStats({
        totalChancesCount: safeProjects.length,
        openChancesCount: openCount,
        pendingRequestsCount: totalPending,
        acceptedVolunteersCount: acceptedTotal,
      });
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrgDashboard();
  }, [loadOrgDashboard]);

  const handleToggleStatus = async (
    project: ProjectItem,
    nextStatus: ProjectStatus,
  ) => {
    setUpdatingId(project.id);
    setErrorMsg(null);
    try {
      await organizationApi.updateProjectStatus(project.id, nextStatus);
      Alert.alert('تم التحديث', 'تم تحديث حالة الفرصة التطوعية بنجاح.');
      await loadOrgDashboard(true);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewProjectRequests = (project: ProjectItem) => {
    navigation.navigate('RequestsTab', {
      projectId: project.id,
      projectTitle: project.title,
    });
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrgDashboard(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <HomeTopHeader
          userName={user.name ?? 'جمعية'}
          title={`لوحة الجمعية: ${user.name}`}
          subtitle="أنشئ فرصاً تطوعية جديدة، تابع المتقدمين، وأدر مشاريعك المجتمعية بكفاءة."
          onSignOut={signOut}
        />

        <ErrorBanner message={errorMsg} />

        {/* Quick CTA Banner to Post New Chance */}
        <TouchableOpacity
          style={styles.postChanceBanner}
          onPress={() => navigation.navigate('PostChanceTab')}
          activeOpacity={0.88}
        >
          <View style={styles.postBannerTextCol}>
            <Text style={styles.postBannerTitle}>+ نشر فرصة تطوعية جديدة</Text>
            <Text style={styles.postBannerSub}>
              حدد المهارات المطلوبة واستقطب أفضل المتطوعين لمبادرتك
            </Text>
          </View>
          <View style={styles.postBannerIconBox}>
            <Text style={styles.postBannerIcon}>✨</Text>
          </View>
        </TouchableOpacity>

        {/* Organization Summary Stats */}
        <OrgStatsRow stats={stats} />

        {/* Organization Published Chances List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            فرص ومشاريع الجمعية ({projects.length})
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RequestsTab')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllRequestsLink}>كل طلبات المتطوعين ←</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : projects.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              لم تقم بنشر أي فرصة تطوعية بعد
            </Text>
            <Text style={styles.emptySubtitle}>
              ابدأ بنشر أول مشروع تطوعي لجمعيتك ليظهر للمتطوعين المطابقين.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('PostChanceTab')}
            >
              <Text style={styles.emptyBtnText}>نشر فرصة تطوعية الآن</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {projects.map((proj) => (
              <OrgProjectCard
                key={proj.id}
                project={proj}
                pendingCount={pendingByProject[proj.id] ?? 0}
                updatingId={updatingId}
                onPressViewRequests={handleViewProjectRequests}
                onPressToggleStatus={handleToggleStatus}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
  postChanceBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    gap: 12,
  },
  postBannerTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  postBannerTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: COLORS.background,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  postBannerSub: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.background,
    opacity: 0.9,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  postBannerIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(13, 27, 20, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBannerIcon: {
    fontSize: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  viewAllRequestsLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  loaderBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 14,
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
  },
});