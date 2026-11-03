import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { FullScreenLoader } from '../components/common/FullScreenLoader';

export const RootNavigator: React.FC = () => {
  const { user, isHydrating } = useAuth();

  if (isHydrating) {
    return (
      <SafeAreaProvider>
        <FullScreenLoader />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};