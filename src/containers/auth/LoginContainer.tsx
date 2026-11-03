import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../utils/error.util';
import { ScreenLayout } from '../../components/common/ScreenLayout';
import { AppInput } from '../../components/common/AppInput';
import { PasswordInput } from '../../components/common/PasswordInput';
import { AppButton } from '../../components/common/AppButton';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { DemoCredentialsBox } from '../../components/auth/DemoCredentialsBox';
import { AuthSwitchLink } from '../../components/auth/AuthSwitchLink';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginContainer: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMsg(null);
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: trimmedEmail, password });
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'volunteer' | 'org') => {
    setErrorMsg(null);
    if (type === 'volunteer') {
      setEmail('volunteer@athar.dev');
      setPassword('Volunteer#Demo2026');
    } else {
      setEmail('org@athar.dev');
      setPassword('Org#Demo2026!');
    }
  };

  return (
    <ScreenLayout
      onBack={() => navigation.goBack()}
      contentStyle={styles.centered}
    >
      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to continue making an impact with ATHAR."
      />

      <ErrorBanner message={errorMsg} />

      <View style={styles.form}>
        <AppInput
          label="Email Address"
          placeholder="amina@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />

        <AppButton title="Sign In" onPress={handleLogin} loading={loading} />
      </View>

      <DemoCredentialsBox onSelectDemo={handleFillDemo} />

      <AuthSwitchLink
        promptText="Don't have an account?"
        actionText="Create Account"
        onPress={() => navigation.navigate('SignUp')}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  centered: { justifyContent: 'center' },
  form: { gap: 18 },
});