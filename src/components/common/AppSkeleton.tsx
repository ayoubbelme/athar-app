import React, { useEffect, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonBlockProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base animated shimmer block running on the native UI thread (60fps).
 */
export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
          backgroundColor: colors.surfaceLight,
        },
        style,
      ]}
    />
  );
};

/**
 * 1. Skeleton for a single Project / Chance Card (with Donut Ring & Footer Buttons)
 */
export const ChanceCardSkeleton: React.FC<{ featured?: boolean }> = ({
  featured = false,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        featured && styles.cardFeatured,
      ]}
    >
      <View style={styles.rowBetween}>
        <View style={styles.rightCol}>
          <View style={styles.rowReverse}>
            <SkeletonBlock width={90} height={22} borderRadius={12} />
            <SkeletonBlock width={60} height={22} borderRadius={8} />
          </View>
          <SkeletonBlock width="88%" height={20} borderRadius={6} />
          <SkeletonBlock width="62%" height={18} borderRadius={6} />
        </View>

        {/* Donut Chart Ring Skeleton */}
        <View style={styles.donutSkeleton}>
          <SkeletonBlock width={56} height={56} borderRadius={28} />
          <View style={[styles.donutInnerCutout, { backgroundColor: colors.surface }]} />
        </View>
      </View>

      <SkeletonBlock width="95%" height={14} borderRadius={6} />

      <View style={styles.chipsRow}>
        <SkeletonBlock width={85} height={26} borderRadius={8} />
        <SkeletonBlock width={95} height={26} borderRadius={8} />
        <SkeletonBlock width={75} height={26} borderRadius={8} />
      </View>

      {featured && (
        <SkeletonBlock width="100%" height={36} borderRadius={10} />
      )}

      <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
        <SkeletonBlock style={styles.flexBtnPrimary} height={42} borderRadius={12} />
        <SkeletonBlock style={styles.flexBtnSecondary} height={42} borderRadius={12} />
      </View>
    </View>
  );
};

/**
 * 2. Full Home Dashboard Skeleton (Best Chance Hero + 3 Stats Cards + Matched List)
 */
export const HomeDashboardSkeleton: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      {/* Section Title */}
      <View style={styles.rowBetween}>
        <SkeletonBlock width={175} height={22} borderRadius={6} />
        <SkeletonBlock width={95} height={24} borderRadius={12} />
      </View>

      {/* Best Skill Chance Hero Card */}
      <ChanceCardSkeleton featured />

      {/* 3 Stats Summary Row */}
      <SkeletonBlock
        width={160}
        height={20}
        borderRadius={6}
        style={styles.alignRight}
      />
      <View style={styles.statsRow}>
        {[1, 2, 3].map((k) => (
          <View
            key={k}
            style={[
              styles.statCardSkeleton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <SkeletonBlock width={54} height={26} borderRadius={8} />
            <SkeletonBlock width={68} height={13} borderRadius={5} />
            <SkeletonBlock width={48} height={10} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Matched Opportunities Section */}
      <View style={styles.rowBetween}>
        <SkeletonBlock width={150} height={20} borderRadius={6} />
        <SkeletonBlock width={85} height={16} borderRadius={6} />
      </View>
      <ChanceCardSkeleton />
      <ChanceCardSkeleton />
    </View>
  );
};

/**
 * 3. Chances List Skeleton (3 Project Cards)
 */
export const ChancesListSkeleton: React.FC = () => {
  const { colors: _colors } = useTheme();
  return (
    <View style={styles.listPadding}>
      <ChanceCardSkeleton />
      <ChanceCardSkeleton />
      <ChanceCardSkeleton />
    </View>
  );
};

/**
 * 4. Requests / Applications List Skeleton
 */
export const RequestsListSkeleton: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.listPadding}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={styles.rightCol}>
              <View style={styles.rowReverse}>
                <SkeletonBlock width={85} height={16} borderRadius={6} />
                <SkeletonBlock width={75} height={22} borderRadius={8} />
              </View>
              <SkeletonBlock width="82%" height={20} borderRadius={6} />
            </View>
            <View style={styles.donutSkeleton}>
              <SkeletonBlock width={50} height={50} borderRadius={25} />
              <View style={[styles.donutInnerCutoutSmall, { backgroundColor: colors.surface }]} />
            </View>
          </View>

          <View style={styles.rowBetween}>
            <SkeletonBlock width={130} height={14} borderRadius={5} />
            <SkeletonBlock width={90} height={14} borderRadius={5} />
          </View>

          <SkeletonBlock width="100%" height={44} borderRadius={10} />
        </View>
      ))}
    </View>
  );
};

/**
 * 5. Profile Screen Skeleton
 */
export const ProfileScreenSkeleton: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      {/* Profile Header Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.rowReverse}>
          <SkeletonBlock width={58} height={58} borderRadius={29} />
          <View style={styles.rightCol}>
            <SkeletonBlock width={150} height={20} borderRadius={6} />
            <SkeletonBlock width={180} height={14} borderRadius={5} />
          </View>
        </View>
        <SkeletonBlock width="100%" height={64} borderRadius={14} />
      </View>

      {/* Skills Chips */}
      <SkeletonBlock
        width={140}
        height={20}
        borderRadius={6}
        style={styles.alignRight}
      />
      <View style={styles.chipsRow}>
        <SkeletonBlock width={110} height={36} borderRadius={12} />
        <SkeletonBlock width={125} height={36} borderRadius={12} />
        <SkeletonBlock width={95} height={36} borderRadius={12} />
      </View>

      {/* Service Action Cards */}
      <SkeletonBlock
        width={130}
        height={20}
        borderRadius={6}
        style={styles.alignRight}
      />
      {[1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.card,
            styles.rowReverse,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <SkeletonBlock width={50} height={50} borderRadius={14} />
          <View style={styles.rightCol}>
            <SkeletonBlock width="80%" height={18} borderRadius={6} />
            <SkeletonBlock width="95%" height={13} borderRadius={5} />
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * 6. Leaderboard / Rank Screen Skeleton (Hero + Podium + Rows)
 */
export const LeaderboardSkeleton: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      {/* My Rank Hero Card */}
      <View
        style={[
          styles.card,
          styles.cardFeatured,
          {
            backgroundColor: colors.surface,
            borderColor: 'rgba(0, 186, 102, 0.45)',
          },
        ]}
      >
        <View style={styles.rowReverse}>
          <SkeletonBlock width={68} height={68} borderRadius={20} />
          <View style={styles.rightCol}>
            <SkeletonBlock width={160} height={14} borderRadius={5} />
            <SkeletonBlock width={190} height={22} borderRadius={6} />
            <SkeletonBlock width={130} height={13} borderRadius={5} />
          </View>
        </View>
        <SkeletonBlock width="100%" height={54} borderRadius={14} />
        <SkeletonBlock width="100%" height={38} borderRadius={10} />
      </View>

      {/* Podium Skeleton */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <SkeletonBlock
          width={180}
          height={20}
          borderRadius={6}
          style={styles.alignRight}
        />
        <View style={styles.podiumRow}>
          <View style={styles.podiumCol}>
            <SkeletonBlock width={48} height={48} borderRadius={24} />
            <SkeletonBlock width={70} height={13} borderRadius={5} />
            <SkeletonBlock width="100%" height={48} borderRadius={10} />
          </View>
          <View style={styles.podiumCol}>
            <SkeletonBlock width={60} height={60} borderRadius={30} />
            <SkeletonBlock width={80} height={15} borderRadius={5} />
            <SkeletonBlock width="100%" height={68} borderRadius={10} />
          </View>
          <View style={styles.podiumCol}>
            <SkeletonBlock width={48} height={48} borderRadius={24} />
            <SkeletonBlock width={70} height={13} borderRadius={5} />
            <SkeletonBlock width="100%" height={38} borderRadius={10} />
          </View>
        </View>
      </View>

      {/* Rows */}
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.card,
            styles.rowBetween,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.rowReverse}>
            <SkeletonBlock width={34} height={34} borderRadius={10} />
            <SkeletonBlock width={42} height={42} borderRadius={21} />
            <View style={styles.rightCol}>
              <SkeletonBlock width={120} height={16} borderRadius={5} />
              <SkeletonBlock width={150} height={12} borderRadius={4} />
            </View>
          </View>
          <SkeletonBlock width={68} height={42} borderRadius={12} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    borderWidth: 0.5,
    borderColor: 'rgba(0, 186, 102, 0.14)',
  },
  stack: {
    gap: 16,
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardFeatured: {
    borderWidth: 1.5,
  },
  rowBetween: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  rightCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  donutSkeleton: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInnerCutout: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  donutInnerCutoutSmall: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  flexBtnPrimary: {
    flex: 1.4,
  },
  flexBtnSecondary: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  statCardSkeleton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  podiumRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
});
