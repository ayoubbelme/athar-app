import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface UserSkillsSectionProps {
  skills: Array<{ id: string; name: string }>;
}

export const UserSkillsSection: React.FC<UserSkillsSectionProps> = ({ skills }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>مهاراتي واهتماماتي</Text>
      {skills.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>لم تقم بإضافة مهارات بعد.</Text>
        </View>
      ) : (
        <View style={styles.skillsRow}>
          {skills.map((skill) => (
            <View key={skill.id} style={[styles.skillChip, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <Text style={[styles.skillChipText, { color: colors.text }]}>⚡ {skill.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  skillsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skillChipText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  emptyBox: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
