import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { HomeDashboardSkeleton, SkeletonBlock } from './AppSkeleton';

export const FullScreenLoader: React.FC = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
