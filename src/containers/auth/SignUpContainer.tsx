import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../utils/error.util';
import { SelfRegistrationRole } from '../../types/auth.types';
import { ScreenLayout } from '../../components/common/ScreenLayout';
import { AppInput } from '../../components/common/AppInput';
import { PasswordInput } from '../../components/common/PasswordInput';
import { AppButton } from '../../components/common/AppButton';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { RoleTabs } from '../../components/auth/RoleTabs';
import { AuthSwitchLink } from '../../components/auth/AuthSwitchLink';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

interface SignUpContainerProps {
  initialRole?: SelfRegistrationRole;
}

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const SignUpContainer: React.FC<SignUpContainerProps> = ({
  initialRole = 'VOLUNTEER',
}) => {
  const navigation = useNavigation<NavProp>();
  const { signUp } = useAuth();

  const [role, setRole] = useState<SelfRegistrationRole>(initialRole);
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateClientSide = (): string | null => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return 'Name must be between 2 and 100 characters.';
    }
    if (role === 'ORGANIZATION') {
      const trimmedOrg = organizationName.trim();
      if (!trimmedOrg) {
        return 'Organization name is required for organization accounts.';
      }
      if (trimmedOrg.length > 150) {
        return 'Organization name cannot exceed 150 characters.';
      }
    }
    if (!email.trim().includes('@')) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 8 || password.length > 128) {
      return 'Password must be at least 8 characters long.';
    }
    if (!PASSWORD_REGEX.test(password)) {
      return 'Password must contain at least one letter and one number.';
    }
    return null;
  };

  const handleRegister = async () => {
    setErrorMsg(null);
    const validationError = validateClientSide();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name,
        email,
        password,
        role,
        organizationName: role === 'ORGANIZATION' ? organizationName : undefined,
        location: location || undefined,
      });
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (newRole: SelfRegistrationRole) => {
    setRole(newRole);
    setErrorMsg(null);
  };

  return (
    <ScreenLayout onBack={() => navigation.goBack()}>
      <AuthHeader
        title="Create Account"
        subtitle="Join ATHAR and start building measurable community impact."
      />

      <RoleTabs selectedRole={role} onChangeRole={handleRoleChange} />

      <ErrorBanner message={errorMsg} />

      <View style={styles.form}>
        <AppInput
          label={
            role === 'ORGANIZATION'
              ? 'Representative Full Name *'
              : 'Full Name *'
          }
          placeholder="Amina Benali"
          value={name}
          onChangeText={setName}
          maxLength={100}
        />

        {role === 'ORGANIZATION' && (
          <AppInput
            label="Organization Name *"
            placeholder="Green Hands Association"
            value={organizationName}
            onChangeText={setOrganizationName}
            maxLength={150}
          />
        )}

        <AppInput
          label="Email Address *"
          placeholder="amina@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <AppInput
          label="City / Location (Optional)"
          placeholder="e.g. Algiers, Blida, Oran"
          value={location}
          onChangeText={setLocation}
          maxLength={100}
        />

        <PasswordInput
          label="Password *"
          placeholder="Min 8 chars, 1 letter & 1 number"
          value={password}
          onChangeText={setPassword}
          helperText="Must be at least 8 characters and include a letter and a digit."
        />

        <AppButton
          title={
            role === 'ORGANIZATION'
              ? 'Register Organization'
              : 'Join as Volunteer'
          }
          onPress={handleRegister}
          loading={loading}
        />
      </View>

      <AuthSwitchLink
        promptText="Already have an account?"
        actionText="Sign In"
        onPress={() => navigation.navigate('Login')}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  form: { gap: 16 },
});