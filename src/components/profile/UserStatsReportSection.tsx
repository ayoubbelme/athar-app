import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { UserProfileStats } from '../../types/profile.types';

interface UserStatsReportSectionProps {
  stats: UserProfileStats;
}

export const UserStatsReportSection: React.FC<UserStatsReportSectionProps> = ({
  stats,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>تقرير وإحصائيات الأثر المجتمعي 📊</Text>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.hoursCount} ساعة</Text>
          <Text style={styles.statLabel}>إجمالي ساعات التطوع</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.projectsCompletedCount} مشاريع</Text>
          <Text style={styles.statLabel}>المشاريع المكتملة</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>نسبة التزام الحضور</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>نشط ⭐</Text>
          <Text style={styles.statLabel}>تقييم الجمعيات</Text>
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
    color: COLORS.text,
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
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});