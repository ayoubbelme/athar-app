import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface DemoCredentialsBoxProps {
  onSelectDemo: (type: 'volunteer' | 'org') => void;
}

export const DemoCredentialsBox: React.FC<DemoCredentialsBoxProps> = ({
  onSelectDemo,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.demoSection, { borderTopColor: colors.border }]}>
      <Text style={[styles.demoLabel, { color: colors.textSecondary }]}>تجربة سريعة بحسابات جاهزة</Text>
      <View style={styles.demoRow}>
        <TouchableOpacity
          style={[styles.demoChip, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
          onPress={() => onSelectDemo('volunteer')}
        >
          <Text style={[styles.demoChipText, { color: colors.text }]}>حساب متطوع تجريبي</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoChip, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
          onPress={() => onSelectDemo('org')}
        >
          <Text style={[styles.demoChipText, { color: colors.text }]}>حساب جمعية تجريبي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  demoSection: {
    marginTop: 28,
    paddingTop: 18,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  demoLabel: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '700',
  },
  demoRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  demoChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  demoChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
