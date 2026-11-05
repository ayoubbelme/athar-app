import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 22,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
