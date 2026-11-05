import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { UserProfileStats } from '../../types/profile.types';

interface UserStatsReportSectionProps {
  stats: UserProfileStats;
}

export const UserStatsReportSection: React.FC<UserStatsReportSectionProps> = ({
  stats,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>تقرير وإحصائيات الأثر المجتمعي 📊</Text>

      <View style={styles.grid}>
        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.hoursCount} ساعة</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>إجمالي ساعات التطوع</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.projectsCompletedCount} مشاريع</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>المشاريع المكتملة</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>100%</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>نسبة التزام الحضور</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>نشط ⭐</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>تقييم الجمعيات</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12.5,
    textAlign: 'center',
  },
});
