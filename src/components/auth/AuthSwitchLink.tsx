import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';

interface AuthSwitchLinkProps {
  promptText: string;
  actionText: string;
  onPress: () => void;
}

export const AuthSwitchLink: React.FC<AuthSwitchLinkProps> = ({
  promptText,
  actionText,
  onPress,
}) => (
  <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.text}>
      {promptText} <Text style={styles.accent}>{actionText}</Text>
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    marginTop: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 14.5,
  },
  accent: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});