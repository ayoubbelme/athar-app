import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { AppVectorIcon } from '../common/AppVectorIcon';

interface ProfileActionCardsProps {
  onPressMarketplace: () => void;
  onPressStatsReport: () => void;
}

export const ProfileActionCards: React.FC<ProfileActionCardsProps> = ({
  onPressMarketplace,
  onPressStatsReport,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الخدمات والتقارير</Text>

      <View style={styles.cardsColumn}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={onPressMarketplace}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <AppVectorIcon name="gift" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.cardTitle}>
              متجر المكافآت والدورات التدريبية
            </Text>
            <Text style={styles.cardSubtitle}>
              استبدل نقاط أثرك بدورات تعليمية ومكافآت مميزة
            </Text>
          </View>
          <View style={styles.arrowBox}>
            <AppVectorIcon name="arrow-left" size={15} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onPressStatsReport}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <AppVectorIcon name="chart" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.cardTitle}>تقرير وإحصائيات الأثر المجتمعي</Text>
            <Text style={styles.cardSubtitle}>
              استعرض ساعات تطوعك، المشاريع المكتملة، وتقييم الأداء
            </Text>
          </View>
          <View style={styles.arrowBox}>
            <AppVectorIcon name="arrow-left" size={15} color={COLORS.primary} />
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
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cardsColumn: {
    gap: 14,
  },
  actionCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 14,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  arrowBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});