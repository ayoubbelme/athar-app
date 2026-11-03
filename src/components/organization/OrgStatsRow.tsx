import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { OrganizationDashboardStats } from '../../types/organization.types';

interface OrgStatsRowProps {
  stats: OrganizationDashboardStats;
}

export const OrgStatsRow: React.FC<OrgStatsRowProps> = ({ stats }) => (
  <View style={styles.row}>
    <View style={styles.card}>
      <Text style={styles.value}>{stats.openChancesCount}</Text>
      <Text style={styles.label}>فرص مفتوحة</Text>
    </View>

    <View style={[styles.card, styles.highlightCard]}>
      <Text style={[styles.value, styles.highlightValue]}>
        {stats.pendingRequestsCount}
      </Text>
      <Text style={styles.label}>طلبات بانتظار المراجعة</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.value}>{stats.acceptedVolunteersCount}</Text>
      <Text style={styles.label}>متطوع مقبول</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginBottom: 22,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  highlightCard: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.08)',
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  highlightValue: {
    color: COLORS.primary,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});