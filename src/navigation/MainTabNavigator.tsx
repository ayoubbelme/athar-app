import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { ChancesScreen } from '../screens/ChancesScreen';
import { PostChanceScreen } from '../screens/PostChanceScreen';
import { RequestsScreen } from '../screens/RequestsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TabIcon, TabIconType } from '../components/common/TabIcon';
import { GlobalTopMenuBar } from '../components/common/GlobalTopMenuBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_TITLES: Record<string, string> = {
  HomeTab: 'الرئيسية',
  ChancesTab: 'استكشاف الفرص التطوعية',
  PostChanceTab: 'نشر فرصة تطوعية جديدة',
  RequestsTab: 'طلبات التطوع والأثر',
  ProfileTab: 'الملف الشخصي',
};

export const MainTabNavigator: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const isOrganization = user?.role === 'ORGANIZATION';

  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: true,
        header: () => (
          <GlobalTopMenuBar
            screenTitle={TAB_TITLES[route.name] ?? 'منصة أثر'}
          />
        ),
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused }) => {
          let iconType: TabIconType = 'home';
          const routeName = route.name as string;

          if (routeName === 'ChancesTab') {
            iconType = 'chances';
          } else if (routeName === 'PostChanceTab') {
            iconType = 'add';
          } else if (routeName === 'RequestsTab') {
            iconType = 'requests';
          } else if (routeName === 'ProfileTab') {
            iconType = 'profile';
          }

          return (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: 'rgba(0, 186, 102, 0.16)',
                  borderWidth: 1.5,
                  borderColor: colors.primary,
                },
              ]}
            >
              <TabIcon type={iconType} focused={focused} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      {isOrganization ? (
        <Tab.Screen
          name={'PostChanceTab' as keyof MainTabParamList}
          component={PostChanceScreen}
        />
      ) : (
        <Tab.Screen name="ChancesTab" component={ChancesScreen} />
      )}
      <Tab.Screen
        name={'RequestsTab' as keyof MainTabParamList}
        component={RequestsScreen}
      />
      <Tab.Screen
        name={'ProfileTab' as keyof MainTabParamList}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
