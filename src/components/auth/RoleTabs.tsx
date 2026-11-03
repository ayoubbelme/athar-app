import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SelfRegistrationRole } from '../../types/auth.types';

interface RoleTabsProps {
  selectedRole: SelfRegistrationRole;
  onChangeRole: (role: SelfRegistrationRole) => void;
}

export const RoleTabs: React.FC<RoleTabsProps> = ({
  selectedRole,
  onChangeRole,
}) => (
  <View style={styles.tabsContainer}>
    {(['VOLUNTEER', 'ORGANIZATION'] as SelfRegistrationRole[]).map((item) => {
      const isActive = selectedRole === item;
      return (
        <TouchableOpacity
          key={item}
          style={[styles.tab, isActive && styles.tabActive]}
          onPress={() => onChangeRole(item)}
        >
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
            {item === 'VOLUNTEER' ? 'Volunteer' : 'Organization'}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 22,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: { color: COLORS.background },
});