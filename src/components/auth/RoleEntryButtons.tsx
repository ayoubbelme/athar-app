import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SelfRegistrationRole } from '../../types/auth.types';

interface RoleEntryButtonsProps {
  onSelectRole: (role: SelfRegistrationRole) => void;
}

export const RoleEntryButtons: React.FC<RoleEntryButtonsProps> = ({
  onSelectRole,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.joinPrompt}>Join ATHAR as a</Text>
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.primaryBtn}
        activeOpacity={0.85}
        onPress={() => onSelectRole('VOLUNTEER')}
      >
        <Text style={styles.primaryTitle}>Volunteer</Text>
        <Text style={styles.primarySub}>Contribute skills & time</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        activeOpacity={0.85}
        onPress={() => onSelectRole('ORGANIZATION')}
      >
        <Text style={styles.secondaryTitle}>Organization</Text>
        <Text style={styles.secondarySub}>Launch & manage projects</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { gap: 12 },
  joinPrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.background,
  },
  primarySub: {
    fontSize: 11.5,
    color: COLORS.background,
    opacity: 0.85,
    marginTop: 4,
    textAlign: 'center',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  secondarySub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});