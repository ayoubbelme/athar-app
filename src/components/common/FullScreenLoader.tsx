import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { HomeDashboardSkeleton, SkeletonBlock } from './AppSkeleton';

export const FullScreenLoader: React.FC = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" />
    <View style={styles.topBar}>
      <View style={styles.rightCluster}>
        <SkeletonBlock width={42} height={42} borderRadius={12} />
        <View style={styles.titleCol}>
          <SkeletonBlock width={90} height={11} borderRadius={4} />
          <SkeletonBlock width={120} height={18} borderRadius={6} />
        </View>
      </View>
      <SkeletonBlock width={96} height={38} borderRadius={14} />
    </View>

    <View style={styles.body}>
      <HomeDashboardSkeleton />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rightCluster: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  titleCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  body: {
    flex: 1,
    padding: 20,
  },
});