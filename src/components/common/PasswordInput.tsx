import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';

interface PasswordInputProps extends TextInputProps {
  label: string;
  helperText?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  helperText,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={!visible}
          autoCapitalize="none"
          {...rest}
        />
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          style={styles.eyeBtn}
        >
          <Text style={styles.eyeText}>{visible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: { gap: 6 },
  label: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
  },
  eyeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  eyeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});