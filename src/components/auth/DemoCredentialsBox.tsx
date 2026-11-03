import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface DemoCredentialsBoxProps {
  onSelectDemo: (type: 'volunteer' | 'org') => void;
}

export const DemoCredentialsBox: React.FC<DemoCredentialsBoxProps> = ({
  onSelectDemo,
}) => (
  <View style={styles.demoSection}>
    <Text style={styles.demoLabel}>Quick Demo Credentials (Seed Data)</Text>
    <View style={styles.demoRow}>
      <TouchableOpacity
        style={styles.demoChip}
        onPress={() => onSelectDemo('volunteer')}
      >
        <Text style={styles.demoChipText}>Demo Volunteer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.demoChip}
        onPress={() => onSelectDemo('org')}
      >
        <Text style={styles.demoChipText}>Demo Organization</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  demoSection: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  demoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  demoChipText: {
    color: COLORS.text,
    fontSize: 12.5,
    fontWeight: '600',
  },
});