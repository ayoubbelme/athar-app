import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface UserSkillsSectionProps {
  skills: Array<{ id: string; name: string }>;
}

export const UserSkillsSection: React.FC<UserSkillsSectionProps> = ({ skills }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>مهاراتي واهتماماتي</Text>
      {skills.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>لم تقم بإضافة مهارات بعد.</Text>
        </View>
      ) : (
        <View style={styles.skillsRow}>
          {skills.map((skill) => (
            <View key={skill.id} style={styles.skillChip}>
              <Text style={styles.skillChipText}>⚡ {skill.name}</Text>
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
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  skillsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skillChipText: {
    color: COLORS.text,
    fontSize: 13.5,
    fontWeight: '700',
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});