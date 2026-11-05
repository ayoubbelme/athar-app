import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SelfRegistrationRole } from '../../types/auth.types';

interface RoleEntryButtonsProps {
  onSelectRole: (role: SelfRegistrationRole) => void;
}

export const RoleEntryButtons: React.FC<RoleEntryButtonsProps> = ({
  onSelectRole,
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.joinPrompt, { color: colors.textSecondary }]}>انضم إلى منصة أثر كـ</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
          onPress={() => onSelectRole('VOLUNTEER')}
        >
          <Text style={[styles.primaryTitle, { color: colors.background }]}>متطوع</Text>
          <Text style={[styles.primarySub, { color: colors.background }]}>ساهم بوقتك ومهاراتك</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: colors.surface, borderColor: colors.primary }]}
          activeOpacity={0.85}
          onPress={() => onSelectRole('ORGANIZATION')}
        >
          <Text style={[styles.secondaryTitle, { color: colors.text }]}>جمعية / منظمة</Text>
          <Text style={[styles.secondarySub, { color: colors.textSecondary }]}>أنشئ وأدر الفرص التطوعية</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  joinPrompt: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  row: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryTitle: {
    fontSize: 16.5,
    fontWeight: '900',
  },
  primarySub: {
    fontSize: 11.5,
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryTitle: {
    fontSize: 16.5,
    fontWeight: '900',
  },
  secondarySub: {
    fontSize: 11.5,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
});
