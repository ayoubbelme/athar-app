import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { SelfRegistrationRole } from '../../types/auth.types';
import { ScreenLayout } from '../../components/common/ScreenLayout';
import { BrandHero } from '../../components/auth/BrandHero';
import { FeatureList } from '../../components/auth/FeatureList';
import { RoleEntryButtons } from '../../components/auth/RoleEntryButtons';
import { AuthSwitchLink } from '../../components/auth/AuthSwitchLink';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeContainer: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const handleSelectRole = (role: SelfRegistrationRole) => {
    navigation.navigate('SignUp', { initialRole: role });
  };

  return (
    <ScreenLayout scrollable contentStyle={styles.layout}>
      <BrandHero />
      <FeatureList />
      <View>
        <RoleEntryButtons onSelectRole={handleSelectRole} />
        <AuthSwitchLink
          promptText="لديك حساب بالفعل؟"
          actionText="تسجيل الدخول"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  layout: {
    justifyContent: 'space-between',
    gap: 20,
  },
});