import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { OrganizationDashboardStats } from '../../types/organization.types';
import { COLORS } from '../../theme/colors';
import { OrgStatsRow } from '../../components/organization/OrgStatsRow';

export const OrgProfileContainer: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<OrganizationDashboardStats>({
    totalChancesCount: 0,
    openChancesCount: 0,
    pendingRequestsCount: 0,
    acceptedVolunteersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSummary = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [projects, requests] = await Promise.all([
        organizationApi.getMyProjects(50),
        organizationApi.getAllIncomingRequests().catch(() => []),
      ]);
      const safeProjects = Array.isArray(projects) ? projects : [];
      const safeRequests = Array.isArray(requests) ? requests : [];

      const openCount = safeProjects.filter(
        (p) => p.status === 'PUBLISHED',
      ).length;
      const pendingCount = safeRequests.filter(
        (r) => r.status === 'PENDING',
      ).length;
      const acceptedCount = safeProjects.reduce(
        (acc, p) => acc + (p.acceptedVolunteers ?? 0),
        0,
      );
      setStats({
        totalChancesCount: safeProjects.length,
        openChancesCount: openCount,
        pendingRequestsCount: pendingCount,
        acceptedVolunteersCount: acceptedCount,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadSummary(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Organization Identity Card */}
        <View style={styles.orgCard}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
              <Text style={styles.signOutText}>تسجيل الخروج</Text>
            </TouchableOpacity>
            <View style={styles.infoCol}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>🏛️ حساب جمعية معتمد</Text>
              </View>
              <Text style={styles.orgName}>{user.name}</Text>
              <Text style={styles.orgEmail}>{user.email}</Text>
              {user.location && (
                <Text style={styles.orgLocation}>📍 {user.location}</Text>
              )}
            </View>
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>إحصائيات الجمعية</Text>
            <OrgStatsRow stats={stats} />

            <View style={styles.actionsBox}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('PostChanceTab')}
              >
                <Text style={styles.actionCardTitle}>
                  ✨ نشر فرصة تطوعية جديدة
                </Text>
                <Text style={styles.actionCardArrow}>←</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('RequestsTab')}
              >
                <Text style={styles.actionCardTitle}>
                  📋 مراجعة طلبات المتطوعين ({stats.pendingRequestsCount} قيد
                  الانتظار)
                </Text>
                <Text style={styles.actionCardArrow}>←</Text>
              </TouchableOpacity>
            </View>
          </>
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
    padding: 20,
    gap: 18,
  },
  orgCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  roleBadge: {
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  roleBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  orgName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'right',
  },
  orgEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  orgLocation: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 2,
  },
  signOutBtn: {
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  signOutText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '700',
  },
  loaderBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  actionsBox: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  actionCardArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
});