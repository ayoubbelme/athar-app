import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { VolunteerStatsSummary } from '../../types/volunteer-home.types';

interface VolunteerStatsRowProps {
  stats: VolunteerStatsSummary;
}

export const VolunteerStatsRow: React.FC<VolunteerStatsRowProps> = ({
  stats,
}) => {
  const { colors } = useTheme();

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
      <Text style={[styles.sectionTitle, { color: colors.text }]}>ملخص نشاطك التطوعي</Text>
      <View style={styles.row}>
        {items.map((item) => (
          <View key={item.key} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {item.value}
              {item.unit ? (
                <Text style={[styles.statUnit, { color: colors.primary }]}> {item.unit}</Text>
              ) : null}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={[styles.statSub, { color: colors.textSecondary }]} numberOfLines={1}>
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
    marginBottom: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  row: { flexDirection: 'row-reverse', gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 13,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  statSub: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
