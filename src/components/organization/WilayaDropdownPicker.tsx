import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { ALGERIA_WILAYAS, WilayaOption } from '../../utils/algeria-wilayas.util';

interface WilayaDropdownPickerProps {
  selectedWilaya: WilayaOption | null;
  onSelectWilaya: (wilaya: WilayaOption) => void;
  addressDetail: string;
  onChangeAddressDetail: (text: string) => void;
}

export const WilayaDropdownPicker: React.FC<WilayaDropdownPickerProps> = ({
  selectedWilaya,
  onSelectWilaya,
  addressDetail,
  onChangeAddressDetail,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWilayas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALGERIA_WILAYAS;
    return ALGERIA_WILAYAS.filter(
      (w) =>
        w.nameAr.includes(q) ||
        w.code.includes(q) ||
        w.nameEn.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleSelect = (wilaya: WilayaOption) => {
    onSelectWilaya(wilaya);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>الولاية (قائمة ولايات الجزائر الـ 58) *</Text>

      {/* Dropdown Trigger Button */}
      <TouchableOpacity
        style={[
          styles.dropdownTrigger,
          selectedWilaya && styles.dropdownTriggerActive,
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.triggerRight}>
          <View style={styles.pinBadge}>
            <Text style={styles.pinIcon}>📍</Text>
          </View>
          <View style={styles.triggerTextCol}>
            <Text
              style={[
                styles.triggerValueText,
                !selectedWilaya && styles.triggerPlaceholderText,
              ]}
            >
              {selectedWilaya
                ? selectedWilaya.displayLabel
                : 'اضغط لاختيار الولاية من القائمة...'}
            </Text>
            {selectedWilaya && (
              <Text style={styles.triggerSubText}>
                {selectedWilaya.code === '00'
                  ? 'متاح للمتطوعين من جميع ولايات الوطن'
                  : `ولاية رقم ${selectedWilaya.code} (${selectedWilaya.nameEn})`}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.chevronBox}>
          <Text style={styles.chevronText}>▼</Text>
        </View>
      </TouchableOpacity>

      {/* Optional Municipality / Exact Location Input */}
      {selectedWilaya && selectedWilaya.code !== '00' && (
        <View style={styles.subAddressBox}>
          <Text style={styles.subLabel}>
            البلدية أو العنوان الدقيق (اختياري)
          </Text>
          <TextInput
            style={styles.subInput}
            placeholder={`مثال: وسط مدينة ${selectedWilaya.nameAr}، دار الشباب...`}
            placeholderTextColor={COLORS.textSecondary}
            value={addressDetail}
            onChangeText={onChangeAddressDetail}
            textAlign="right"
          />
        </View>
      )}

      {/* Searchable Modal for All 58 Wilayas */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>إغلاق ✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>اختر الولاية (58 ولاية)</Text>
            </View>

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث برقم الولاية أو اسمها (مثال: 09، البليدة، المدية)..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredWilayas}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isSelected = selectedWilaya?.code === item.code;
                return (
                  <TouchableOpacity
                    style={[
                      styles.wilayaRow,
                      isSelected && styles.wilayaRowSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.wilayaRowRight}>
                      <View
                        style={[
                          styles.codeBadge,
                          isSelected && styles.codeBadgeSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.codeBadgeText,
                            isSelected && styles.codeBadgeTextSelected,
                          ]}
                        >
                          {item.code === '00' ? '🌐' : item.code}
                        </Text>
                      </View>
                      <View style={styles.wilayaNamesCol}>
                        <Text
                          style={[
                            styles.wilayaNameAr,
                            isSelected && styles.wilayaNameArSelected,
                          ]}
                        >
                          {item.nameAr}
                        </Text>
                        <Text style={styles.wilayaNameEn}>{item.nameEn}</Text>
                      </View>
                    </View>

                    {isSelected && (
                      <Text style={styles.checkMark}>✓ مختارة</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dropdownTrigger: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownTriggerActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.08)',
  },
  triggerRight: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  pinBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    fontSize: 18,
  },
  triggerTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  triggerValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  triggerPlaceholderText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  triggerSubText: {
    fontSize: 11.5,
    color: COLORS.primary,
    fontWeight: '700',
  },
  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '900',
  },
  subAddressBox: {
    width: '100%',
    gap: 6,
    alignItems: 'flex-end',
    marginTop: 2,
  },
  subInput: {
    width: '100%',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: COLORS.text,
    writingDirection: 'rtl',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    height: '80%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1.5,
    borderColor: COLORS.primary,
    paddingTop: 18,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  closeBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.text,
    writingDirection: 'rtl',
  },
  clearSearchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 8,
  },
  wilayaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wilayaRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
  },
  wilayaRowRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  codeBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBadgeSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  codeBadgeText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: COLORS.primary,
  },
  codeBadgeTextSelected: {
    color: COLORS.background,
  },
  wilayaNamesCol: {
    alignItems: 'flex-end',
  },
  wilayaNameAr: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  wilayaNameArSelected: {
    color: COLORS.primary,
  },
  wilayaNameEn: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },
  checkMark: {
    fontSize: 12.5,
    fontWeight: '900',
    color: COLORS.primary,
  },
});