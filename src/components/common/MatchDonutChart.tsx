import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface MatchDonutChartProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const MatchDonutChart: React.FC<MatchDonutChartProps> = ({
  score,
  size = 58,
  strokeWidth = 6,
  label = 'توافق',
}) => {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(100, Math.round(score || 0)));
  const half = size / 2;

  const activeColor =
    clamped >= 70
      ? colors.primary
      : clamped >= 40
      ? '#FFC107'
      : '#38BDF8';

  const rightDeg =
    clamped <= 50 ? -135 + (clamped / 50) * 180 : 45;
  const leftDeg =
    clamped <= 50 ? -135 : -135 + ((clamped - 50) / 50) * 180;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Track Ring */}
      <View
        style={[
          styles.trackRing,
          {
            width: size,
            height: size,
            borderRadius: half,
            borderWidth: strokeWidth,
            borderColor: colors.surfaceLight,
          },
        ]}
      />

      {/* Right Half Clip (0% -> 50%) */}
      <View
        style={[
          styles.halfClip,
          { width: half, height: size, left: half },
        ]}
      >
        <View
          style={[
            styles.halfCircle,
            {
              width: size,
              height: size,
              borderRadius: half,
              borderWidth: strokeWidth,
              left: -half,
              borderTopColor: activeColor,
              borderRightColor: activeColor,
              transform: [{ rotateZ: `${rightDeg}deg` }],
            },
          ]}
        />
      </View>

      {/* Left Half Clip (50% -> 100%) */}
      <View
        style={[
          styles.halfClip,
          { width: half, height: size, left: 0 },
        ]}
      >
        <View
          style={[
            styles.halfCircle,
            {
              width: size,
              height: size,
              borderRadius: half,
              borderWidth: strokeWidth,
              left: 0,
              borderBottomColor: activeColor,
              borderLeftColor: activeColor,
              transform: [{ rotateZ: `${leftDeg}deg` }],
            },
          ]}
        />
      </View>

      {/* Inner Donut Hole with Score & Label */}
      <View style={styles.centerContent}>
        <Text
          style={[
            styles.scoreText,
            { fontSize: size * 0.24, color: activeColor },
          ]}
        >
          {clamped}%
        </Text>
        {Boolean(label) && (
          <Text
            style={[
              styles.labelText,
              { fontSize: Math.max(8.5, size * 0.16), color: colors.textSecondary },
            ]}
          >
            {label}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  trackRing: {
    position: 'absolute',
  },
  halfClip: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    borderColor: 'transparent',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontWeight: '900',
    includeFontPadding: false,
  },
  labelText: {
    fontWeight: '700',
    marginTop: -1,
    includeFontPadding: false,
  },
});
