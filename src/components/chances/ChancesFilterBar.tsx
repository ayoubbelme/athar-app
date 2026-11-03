import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { ProjectCategory } from '../../types/volunteer-home.types';
import { SkillOption } from '../../types/chances.types';
import { translateCategory } from '../../utils/arabic.util';

const ALL_PROJECT_CATEGORIES = [
  'EDUCATION',
  'HEALTH',
  'ENVIRONMENT',
  'SOCIAL',
  'TECHNOLOGY',
  'ARTS',
  'COMMUNITY',
  'OTHER',
] as ProjectCategory[];

interface ChancesFilterBarProps {
  selectedCategory: ProjectCategory | null;
  onSelectCategory: (category: ProjectCategory | null) => void;
  skills: SkillOption[];
  selectedSkillId: string | null;
  onSelectSkill: (skillId: string | null) => void;
  onlyOpenStatus: boolean;
  onToggleOnlyOpen: () => void;
}

export const ChancesFilterBar: React.FC<ChancesFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  skills,
  selectedSkillId,
  onSelectSkill,
  onlyOpenStatus,
  onToggleOnlyOpen,
}) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsScroll}
    >
      <TouchableOpacity
        style={[styles.chip, !selectedCategory && styles.chipActive]}
        onPress={() => onSelectCategory(null)}
      >
        <Text
          style={[styles.chipText, !selectedCategory && styles.chipTextActive]}
        >
          الكل
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chip, onlyOpenStatus && styles.chipStatusActive]}
        onPress={onToggleOnlyOpen}
      >
        <Text
          style={[
            styles.chipText,
            onlyOpenStatus && styles.chipStatusTextActive,
          ]}
        >
          {onlyOpenStatus ? '✓ متاح للتقديم فقط' : 'متاح للتقديم فقط'}
        </Text>
      </TouchableOpacity>

      {ALL_PROJECT_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isSelected && styles.chipActive]}
            onPress={() => onSelectCategory(isSelected ? null : cat)}
          >
            <Text
              style={[styles.chipText, isSelected && styles.chipTextActive]}
            >
              {translateCategory(cat)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>

    {skills.length > 0 && (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        <TouchableOpacity
          style={[styles.skillChip, !selectedSkillId && styles.skillChipActive]}
          onPress={() => onSelectSkill(null)}
        >
          <Text
            style={[
              styles.skillChipText,
              !selectedSkillId && styles.skillChipTextActive,
            ]}
          >
            جميع المهارات
          </Text>
        </TouchableOpacity>

        {skills.map((skill) => {
          const isSelected = selectedSkillId === skill.id;
          return (
            <TouchableOpacity
              key={skill.id}
              style={[styles.skillChip, isSelected && styles.skillChipActive]}
              onPress={() => onSelectSkill(isSelected ? null : skill.id)}
            >
              <Text
                style={[
                  styles.skillChipText,
                  isSelected && styles.skillChipTextActive,
                ]}
              >
                {skill.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chipsScroll: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipStatusActive: {
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderColor: COLORS.primary,
  },
  chipText: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.background },
  chipStatusTextActive: { color: COLORS.primary },
  skillChip: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  skillChipTextActive: { color: COLORS.primary, fontWeight: '800' },
});