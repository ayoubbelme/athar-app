import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { VolunteerStatsSummary } from '../../types/volunteer-home.types';

interface VolunteerStatsRowProps {
  stats: VolunteerStatsSummary;
}

export const VolunteerStatsRow: React.FC<VolunteerStatsRowProps> = ({
  stats,
}) => {
  const items = [
    {
      key: 'hours',
      value: `${stats.hoursOfVolunteering}`,
      unit: 'ساعة',
      label: 'ساعات التطوع',
      sub: 'إجمالي الأثر',
    },
    {
      key: 'requests',
      value: String(stats.requestsCount),
      unit: '',
      label: 'الطلبات',
      sub: 'طلبات الانضمام',
    },
    {
      key: 'projects',
      value: String(stats.projectsCount),
      unit: '',
      label: 'المشاريع',
      sub: 'مشاريع مقبولة',
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ملخص نشاطك التطوعي</Text>
      <View style={styles.row}>
        {items.map((item) => (
          <View key={item.key} style={styles.statCard}>
            <Text style={styles.statValue}>
              {item.value}
              {item.unit ? (
                <Text style={styles.statUnit}> {item.unit}</Text>
              ) : null}
            </Text>
            <Text style={styles.statLabel} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={styles.statSub} numberOfLines={1}>
              {item.sub}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  row: { flexDirection: 'row-reverse', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  statSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});