import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface AppInputProps extends TextInputProps {
  label: string;
}

export const AppInput: React.FC<AppInputProps> = ({ label, style, ...rest }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={COLORS.textSecondary}
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  fieldGroup: { gap: 6 },
  label: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
  },
});