import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AppInputProps extends TextInputProps {
  label: string;
}

export const AppInput: React.FC<AppInputProps> = ({ label, style, ...rest }) => {
  const { colors } = useTheme();
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
      <TextInput
        style={[
          styles.inputBase,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        textAlign="right"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 6,
    alignItems: 'flex-end',
  },
  inputBase: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    writingDirection: 'rtl',
  },
});
