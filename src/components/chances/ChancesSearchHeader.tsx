import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
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
}) => (
  <View style={styles.wrapper}>
    <View style={styles.topRow}>
      <View style={styles.titleCol}>
        <Text style={styles.title}>جميع الفرص التطوعية</Text>
        <Text style={styles.subtitle}>
          ابحث وصفِّ الفرص حسب المجال، المهارة، أو الولاية
        </Text>
      </View>
    </View>

    <View style={styles.searchRow}>
      <View style={styles.searchInputContainer}>
        <View style={styles.iconSpacer}>
          <AppVectorIcon
            name="search"
            size={16}
            color={COLORS.textSecondary}
          />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث بعنوان الفرصة أو الوصف..."
          placeholderTextColor={COLORS.textSecondary}
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
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.filterToggleBtn,
          (showAdvancedFilters || activeFilterCount > 0) &&
            styles.filterToggleBtnActive,
        ]}
        onPress={onToggleAdvancedFilters}
        activeOpacity={0.85}
      >
        <AppVectorIcon
          name="filter"
          size={15}
          color={
            showAdvancedFilters || activeFilterCount > 0
              ? COLORS.primary
              : COLORS.text
          }
        />
        <Text
          style={[
            styles.filterToggleText,
            (showAdvancedFilters || activeFilterCount > 0) &&
              styles.filterToggleTextActive,
          ]}
        >
          تصفية {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </Text>
      </TouchableOpacity>
    </View>

    {showAdvancedFilters && (
      <View style={styles.advancedBox}>
        <View style={styles.locationInputWrapper}>
          <View style={styles.iconSpacer}>
            <AppVectorIcon name="location" size={15} color={COLORS.primary} />
          </View>
          <TextInput
            style={styles.locationInput}
            placeholder="تصفية حسب المدينة / الولاية (مثال: Algiers)..."
            placeholderTextColor={COLORS.textSecondary}
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
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {activeFilterCount > 0 && (
          <TouchableOpacity
            style={styles.resetFiltersBtn}
            onPress={onClearAllFilters}
          >
            <Text style={styles.resetFiltersText}>إعادة تعيين جميع الفلاتر</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.text,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  filterToggleBtnActive: {
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderColor: COLORS.primary,
  },
  filterToggleText: {
    color: COLORS.text,
    fontSize: 13.5,
    fontWeight: '700',
  },
  filterToggleTextActive: {
    color: COLORS.primary,
  },
  advancedBox: {
    gap: 8,
  },
  locationInputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13.5,
    color: COLORS.text,
    writingDirection: 'rtl',
  },
  resetFiltersBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetFiltersText: {
    color: COLORS.error,
    fontSize: 12.5,
    fontWeight: '700',
  },
});