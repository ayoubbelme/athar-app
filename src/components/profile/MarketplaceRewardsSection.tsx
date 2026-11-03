import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
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
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>متجر المكافآت والدورات التدريبية 🎁</Text>
        <Text style={styles.sectionSubtitle}>
          استبدل نقاط أثرك بدورات تعليمية معتمدة ومكافآت مميزة
        </Text>
      </View>

      <View style={styles.list}>
        {tutorials.map((tut) => {
          const isRedeeming = redeemingId === tut.id;
          const canAfford = currentScore >= tut.costScore;

          return (
            <View key={tut.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tut.category}</Text>
                </View>
                <Text style={styles.cardTitle}>{tut.title}</Text>
              </View>

              <Text style={styles.description}>{tut.description}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.duration}>⏱️ المدة: {tut.duration}</Text>
                <View style={styles.costBox}>
                  <Text style={styles.costText}>{tut.costScore} نقطة</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.redeemBtn,
                  (!canAfford || isRedeeming) && styles.redeemBtnDisabled,
                ]}
                onPress={() => onRedeem(tut.id, tut.costScore)}
                disabled={!canAfford || isRedeeming}
                activeOpacity={0.85}
              >
                {isRedeeming ? (
                  <ActivityIndicator color={COLORS.background} size="small" />
                ) : (
                  <Text
                    style={[
                      styles.redeemBtnText,
                      !canAfford && styles.redeemBtnTextDisabled,
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
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  badge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  description: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  costBox: {
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  costText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
  redeemBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  redeemBtnDisabled: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  redeemBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
  },
  redeemBtnTextDisabled: {
    color: COLORS.textSecondary,
  },
});