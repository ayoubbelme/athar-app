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
      return 'يجب أن يتراوح الاسم بين حرفين و100 حرف.';
    }
    if (role === 'ORGANIZATION') {
      const trimmedOrg = organizationName.trim();
      if (!trimmedOrg) {
        return 'اسم الجمعية أو المنظمة مطلوب لإنشاء حساب جمعية.';
      }
      if (trimmedOrg.length > 150) {
        return 'اسم الجمعية لا يمكن أن يتجاوز 150 حرفاً.';
      }
    }
    if (!email.trim().includes('@')) {
      return 'يرجى إدخال عنوان بريد إلكتروني صحيح.';
    }
    if (password.length < 8 || password.length > 128) {
      return 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.';
    }
    if (!PASSWORD_REGEX.test(password)) {
      return 'يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل.';
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
        title="إنشاء حساب جديد"
        subtitle="انضم إلى مجتمع أثر وابدأ في بناء أثر تطوعي ومجتمعي ملموس."
      />

      <RoleTabs selectedRole={role} onChangeRole={handleRoleChange} />

      <ErrorBanner message={errorMsg} />

      <View style={styles.form}>
        <AppInput
          label={
            role === 'ORGANIZATION'
              ? 'الاسم الكامل لممثل الجمعية *'
              : 'الاسم الكامل *'
          }
          placeholder="مثال: أمينة بن علي"
          value={name}
          onChangeText={setName}
          maxLength={100}
        />

        {role === 'ORGANIZATION' && (
          <AppInput
            label="اسم الجمعية أو المنظمة *"
            placeholder="مثال: جمعية الأيادي الخضراء"
            value={organizationName}
            onChangeText={setOrganizationName}
            maxLength={150}
          />
        )}

        <AppInput
          label="البريد الإلكتروني *"
          placeholder="amina@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <AppInput
          label="المدينة / الولاية (اختياري)"
          placeholder="مثال: الجزائر العاصمة، البليدة، المدية"
          value={location}
          onChangeText={setLocation}
          maxLength={100}
        />

        <PasswordInput
          label="كلمة المرور *"
          placeholder="8 أحرف على الأقل، تشمل حرفاً ورقماً"
          value={password}
          onChangeText={setPassword}
          helperText="يجب أن تتكون من 8 أحرف على الأقل وتضم حرفاً ورقماً."
        />

        <AppButton
          title={
            role === 'ORGANIZATION'
              ? 'تسجيل حساب الجمعية'
              : 'الانضمام كمتطوع'
          }
          onPress={handleRegister}
          loading={loading}
        />
      </View>

      <AuthSwitchLink
        promptText="لديك حساب بالفعل؟"
        actionText="تسجيل الدخول"
        onPress={() => navigation.navigate('Login')}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  form: { gap: 16 },
});