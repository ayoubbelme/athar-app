import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { OrganizationDashboardStats } from '../../types/organization.types';

interface OrgStatsRowProps {
  stats: OrganizationDashboardStats;
}

export const OrgStatsRow: React.FC<OrgStatsRowProps> = ({ stats }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.value, { color: colors.text }]}>{stats.openChancesCount}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>فرص مفتوحة</Text>
      </View>

      <View style={[styles.card, styles.highlightCard, { borderColor: colors.primary }]}>
        <Text style={[styles.value, { color: colors.primary }]}>
          {stats.pendingRequestsCount}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>طلبات بانتظار المراجعة</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.value, { color: colors.text }]}>{stats.acceptedVolunteersCount}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>متطوع مقبول</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginBottom: 22,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  highlightCard: {
    backgroundColor: 'rgba(0, 186, 102, 0.08)',
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
