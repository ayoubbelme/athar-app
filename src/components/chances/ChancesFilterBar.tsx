import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
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
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { borderBottomColor: colors.border }]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            { backgroundColor: colors.surface, borderColor: colors.border },
            !selectedCategory && {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text
            style={[
              styles.chipText,
              { color: colors.textSecondary },
              !selectedCategory && { color: colors.background },
            ]}
          >
            الكل
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            { backgroundColor: colors.surface, borderColor: colors.border },
            onlyOpenStatus && {
              backgroundColor: 'rgba(0, 186, 102, 0.16)',
              borderColor: colors.primary,
            },
          ]}
          onPress={onToggleOnlyOpen}
        >
          <Text
            style={[
              styles.chipText,
              { color: colors.textSecondary },
              onlyOpenStatus && { color: colors.primary },
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
              style={[
                styles.chip,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isSelected && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => onSelectCategory(isSelected ? null : cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: colors.textSecondary },
                  isSelected && { color: colors.background },
                ]}
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
            style={[
              styles.skillChip,
              { backgroundColor: colors.surfaceLight, borderColor: colors.border },
              !selectedSkillId && { borderColor: colors.primary },
            ]}
            onPress={() => onSelectSkill(null)}
          >
            <Text
              style={[
                styles.skillChipText,
                { color: colors.textSecondary },
                !selectedSkillId && { color: colors.primary, fontWeight: '800' },
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
                style={[
                  styles.skillChip,
                  { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(0, 186, 102, 0.14)',
                  },
                ]}
                onPress={() => onSelectSkill(isSelected ? null : skill.id)}
              >
                <Text
                  style={[
                    styles.skillChipText,
                    { color: colors.textSecondary },
                    isSelected && { color: colors.primary, fontWeight: '800' },
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
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  chipsScroll: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
  skillChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
