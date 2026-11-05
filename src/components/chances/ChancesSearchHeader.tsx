import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppVectorIcon } from '../common/AppVectorIcon';

interface ChancesSearchHeaderProps {
  searchQuery: string;
  onChangeSearch: (text: string) => void;
  locationQuery: string;
  onChangeLocation: (text: string) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  activeFilterCount: number;
  onClearAllFilters: () => void;
  onBack?: () => void;
}

export const ChancesSearchHeader: React.FC<ChancesSearchHeaderProps> = ({
  searchQuery,
  onChangeSearch,
  locationQuery,
  onChangeLocation,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  activeFilterCount,
  onClearAllFilters,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: colors.text }]}>
            جميع الفرص التطوعية
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            ابحث وصفِّ الفرص حسب المجال، المهارة، أو الولاية
          </Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.iconSpacer}>
            <AppVectorIcon
              name="search"
              size={16}
              color={colors.textSecondary}
            />
          </View>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="ابحث بعنوان الفرصة أو الوصف..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={onChangeSearch}
            textAlign="right"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeSearch('')}
              style={styles.clearBtn}
            >
              <AppVectorIcon
                name="close"
                size={13}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterToggleBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            (showAdvancedFilters || activeFilterCount > 0) && {
              backgroundColor: 'rgba(0, 186, 102, 0.16)',
              borderColor: colors.primary,
            },
          ]}
          onPress={onToggleAdvancedFilters}
          activeOpacity={0.85}
        >
          <AppVectorIcon
            name="filter"
            size={15}
            color={
              showAdvancedFilters || activeFilterCount > 0
                ? colors.primary
                : colors.text
            }
          />
          <Text
            style={[
              styles.filterToggleText,
              { color: colors.text },
              (showAdvancedFilters || activeFilterCount > 0) && {
                color: colors.primary,
              },
            ]}
          >
            تصفية {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {showAdvancedFilters && (
        <View style={styles.advancedBox}>
          <View
            style={[
              styles.locationInputWrapper,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.iconSpacer}>
              <AppVectorIcon name="location" size={15} color={colors.primary} />
            </View>
            <TextInput
              style={[styles.locationInput, { color: colors.text }]}
              placeholder="تصفية حسب المدينة / الولاية (مثال: Algiers)..."
              placeholderTextColor={colors.textSecondary}
              value={locationQuery}
              onChangeText={onChangeLocation}
              textAlign="right"
            />
            {locationQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => onChangeLocation('')}
                style={styles.clearBtn}
              >
                <AppVectorIcon
                  name="close"
                  size={13}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {activeFilterCount > 0 && (
            <TouchableOpacity
              style={styles.resetFiltersBtn}
              onPress={onClearAllFilters}
            >
              <Text style={[styles.resetFiltersText, { color: colors.error }]}>
                إعادة تعيين جميع الفلاتر
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  searchRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  iconSpacer: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14.5,
    writingDirection: 'rtl',
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  filterToggleBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  filterToggleText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  advancedBox: {
    gap: 8,
  },
  locationInputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13.5,
    writingDirection: 'rtl',
  },
  resetFiltersBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetFiltersText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
