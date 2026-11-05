import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ErrorBannerProps {
  message: string | null;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  const { colors } = useTheme();
  if (!message) return null;

  return (
    <View
      style={{
        backgroundColor: colors.errorBg,
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
      }}
    >
      <Text style={{ color: colors.error, fontSize: 13.5, fontWeight: '600' }}>
        {message}
      </Text>
    </View>
  );
};
