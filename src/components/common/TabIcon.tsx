import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme/colors';

export type TabIconType = 'home' | 'chances' | 'requests' | 'profile' | 'add';

interface TabIconProps {
  type: TabIconType;
  focused: boolean;
}

/**
 * Pure React Native geometric vector icons (Home, Compass, Requests, Profile, Add Plus).
 * Zero external native font linking required.
 */
export const TabIcon: React.FC<TabIconProps> = ({ type, focused }) => {
  const color = focused ? COLORS.primary : COLORS.textSecondary;

  if (type === 'home') {
    return (
      <View style={styles.canvas}>
        <View style={[styles.homeRoof, { borderColor: color }]} />
        <View style={[styles.homeBody, { borderColor: color }]}>
          <View style={[styles.homeDoor, { borderColor: color }]} />
        </View>
      </View>
    );
  }

  if (type === 'chances') {
    return (
      <View style={styles.canvas}>
        <View style={[styles.compassCircle, { borderColor: color }]}>
          <View style={[styles.compassDiamond, { borderColor: color }]} />
          <View style={[styles.compassCenterDot, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (type === 'add') {
    return (
      <View style={styles.canvas}>
        <View style={[styles.plusCircle, { borderColor: color }]}>
          <View style={[styles.plusHorizontal, { backgroundColor: color }]} />
          <View style={[styles.plusVertical, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (type === 'requests') {
    return (
      <View style={styles.canvas}>
        <View style={[styles.docSheet, { borderColor: color }]}>
          <View style={[styles.docLineLong, { backgroundColor: color }]} />
          <View style={[styles.docLineLong, { backgroundColor: color }]} />
          <View style={[styles.docLineShort, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  // 'profile' user silhouette icon
  return (
    <View style={styles.canvas}>
      <View style={[styles.userHead, { borderColor: color }]} />
      <View style={[styles.userBody, { borderColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    width: 13,
    height: 13,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginBottom: -7,
  },
  homeBody: {
    width: 16,
    height: 12,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeDoor: {
    width: 5,
    height: 6,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  compassCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDiamond: {
    width: 8,
    height: 8,
    borderWidth: 1.8,
    transform: [{ rotate: '45deg' }],
  },
  compassCenterDot: {
    position: 'absolute',
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
  },
  plusCircle: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    width: 2,
    height: 10,
    borderRadius: 1,
  },
  docSheet: {
    width: 17,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    paddingHorizontal: 3,
    paddingVertical: 4,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  docLineLong: {
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  docLineShort: {
    width: '65%',
    height: 2,
    borderRadius: 1,
  },
  userHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    marginBottom: 2,
  },
  userBody: {
    width: 16,
    height: 9,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});