import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RewardTutorialItem } from '../../types/profile.types';

interface MarketplaceRewardsSectionProps {
  tutorials: RewardTutorialItem[];
  currentScore: number;
  onRedeem: (tutorialId: string, cost: number) => void;
  redeemingId: string | null;
}

export const MarketplaceRewardsSection: React.FC<MarketplaceRewardsSectionProps> = ({
  tutorials,
  currentScore,
  onRedeem,
  redeemingId,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>متجر المكافآت والدورات التدريبية 🎁</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          استبدل نقاط أثرك بدورات تعليمية معتمدة ومكافآت مميزة
        </Text>
      </View>

      <View style={styles.list}>
        {tutorials.map((tut) => {
          const isRedeeming = redeemingId === tut.id;
          const canAfford = currentScore >= tut.costScore;

          return (
            <View key={tut.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: colors.surfaceLight }]}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>{tut.category}</Text>
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{tut.title}</Text>
              </View>

              <Text style={[styles.description, { color: colors.textSecondary }]}>{tut.description}</Text>

              <View style={styles.cardFooter}>
                <Text style={[styles.duration, { color: colors.textSecondary }]}>⏱️ المدة: {tut.duration}</Text>
                <View style={[styles.costBox, { borderColor: colors.primary }]}>
                  <Text style={[styles.costText, { color: colors.primary }]}>{tut.costScore} نقطة</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.redeemBtn,
                  { backgroundColor: colors.primary },
                  (!canAfford || isRedeeming) && [styles.redeemBtnDisabled, { backgroundColor: colors.surfaceLight, borderColor: colors.border }],
                ]}
                onPress={() => onRedeem(tut.id, tut.costScore)}
                disabled={!canAfford || isRedeeming}
                activeOpacity={0.85}
              >
                {isRedeeming ? (
                  <ActivityIndicator color={colors.background} size="small" />
                ) : (
                  <Text
                    style={[
                      styles.redeemBtnText,
                      { color: colors.background },
                      !canAfford && { color: colors.textSecondary },
                    ]}
                  >
                    {canAfford ? 'استبدال بالنقاط (فتح الدورة)' : 'نقاط غير كافية'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  headerRow: {
    alignItems: 'flex-end',
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sectionSubtitle: {
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  list: {
    gap: 14,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  duration: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  costBox: {
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  costText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  redeemBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  redeemBtnDisabled: {
    borderWidth: 1,
  },
  redeemBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
