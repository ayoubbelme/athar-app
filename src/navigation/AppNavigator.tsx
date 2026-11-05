import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { ChanceDetailsScreen } from '../screens/ChanceDetailsScreen';
import { UserStatsReportScreen } from '../screens/UserStatsReportScreen';
import { MarketplaceRewardsScreen } from '../screens/MarketplaceRewardsScreen';
import { ImpactLeaderboardScreen } from '../screens/ImpactLeaderboardScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ChanceDetails" component={ChanceDetailsScreen} />
      <Stack.Screen name="UserStatsReport" component={UserStatsReportScreen} />
      <Stack.Screen
        name="MarketplaceRewards"
        component={MarketplaceRewardsScreen}
      />
      <Stack.Screen
        name="ImpactLeaderboard"
        component={ImpactLeaderboardScreen}
      />
    </Stack.Navigator>
  );
};
