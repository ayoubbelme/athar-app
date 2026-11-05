import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AuthSwitchLinkProps {
  promptText: string;
  actionText: string;
  onPress: () => void;
}

export const AuthSwitchLink: React.FC<AuthSwitchLinkProps> = ({
  promptText,
  actionText,
  onPress,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {promptText} <Text style={[styles.accent, { color: colors.primary }]}>{actionText}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 14.5,
  },
  accent: {
    fontWeight: '700',
  },
});
