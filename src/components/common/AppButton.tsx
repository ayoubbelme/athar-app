import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme();
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: colors.primary },
        isDisabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={[styles.btnText, { color: colors.background }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
