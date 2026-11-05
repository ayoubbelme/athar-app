import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { FullScreenLoader } from '../components/common/FullScreenLoader';

export const RootNavigator: React.FC = () => {
  const { user, isHydrating } = useAuth();
  const { mode, isDark } = useTheme();

  if (isHydrating) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <FullScreenLoader />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider key={`theme-root-${mode}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};