import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SelfRegistrationRole } from '../../types/auth.types';

interface RoleTabsProps {
  selectedRole: SelfRegistrationRole;
  onChangeRole: (role: SelfRegistrationRole) => void;
}

export const RoleTabs: React.FC<RoleTabsProps> = ({
  selectedRole,
  onChangeRole,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.tabsContainer,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {(['VOLUNTEER', 'ORGANIZATION'] as SelfRegistrationRole[]).map((item) => {
        const isActive = selectedRole === item;
        return (
          <TouchableOpacity
            key={item}
            style={[styles.tab, isActive && { backgroundColor: colors.primary }]}
            onPress={() => onChangeRole(item)}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                isActive && { color: colors.background },
              ]}
            >
              {item === 'VOLUNTEER' ? 'حساب متطوع' : 'حساب جمعية / منظمة'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row-reverse',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    marginBottom: 22,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
