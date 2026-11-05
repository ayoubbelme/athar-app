import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface PasswordInputProps extends TextInputProps {
  label: string;
  helperText?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  helperText,
  ...rest
}) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text
        style={{
          fontSize: 13.5,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'right',
          writingDirection: 'rtl',
        }}
      >
        {label}
      </Text>
      <View
        style={[
          styles.passwordContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!visible}
          autoCapitalize="none"
          textAlign="right"
          {...rest}
        />
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          style={styles.eyeBtn}
        >
          <Text style={[styles.eyeText, { color: colors.primary }]}>
            {visible ? 'إخفاء' : 'إظهار'}
          </Text>
        </TouchableOpacity>
      </View>
      {helperText && (
        <Text
          style={{
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
            textAlign: 'right',
            writingDirection: 'rtl',
          }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 6,
    alignItems: 'flex-end',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    writingDirection: 'rtl',
  },
  eyeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  eyeText: {
    fontWeight: '800',
    fontSize: 13,
  },
});
