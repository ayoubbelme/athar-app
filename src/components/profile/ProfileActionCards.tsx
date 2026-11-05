import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppVectorIcon } from '../common/AppVectorIcon';

interface ProfileActionCardsProps {
  onPressMarketplace: () => void;
  onPressStatsReport: () => void;
}

export const ProfileActionCards: React.FC<ProfileActionCardsProps> = ({
  onPressMarketplace,
  onPressStatsReport,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>الخدمات والتقارير</Text>

      <View style={styles.cardsColumn}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onPressMarketplace}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { borderColor: colors.primary }]}>
            <AppVectorIcon name="gift" size={22} color={colors.primary} />
          </View>
          <View style={styles.textCol}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              متجر المكافآت والدورات التدريبية
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              استبدل نقاط أثرك بدورات تعليمية ومكافآت مميزة
            </Text>
          </View>
          <View style={[styles.arrowBox, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
            <AppVectorIcon name="arrow-left" size={15} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onPressStatsReport}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { borderColor: colors.primary }]}>
            <AppVectorIcon name="chart" size={22} color={colors.primary} />
          </View>
          <View style={styles.textCol}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>تقرير وإحصائيات الأثر المجتمعي</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              استعرض ساعات تطوعك، المشاريع المكتملة، وتقييم الأداء
            </Text>
          </View>
          <View style={[styles.arrowBox, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
            <AppVectorIcon name="arrow-left" size={15} color={colors.primary} />
          </View>
        </TouchableOpacity>
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
  cardsColumn: {
    gap: 14,
  },
  actionCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    gap: 14,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cardSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  arrowBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
