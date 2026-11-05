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
import { useTheme } from '../../context/ThemeContext';
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
  const { colors } = useTheme();
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
      <Text style={[styles.label, { color: colors.text }]}>الولاية (قائمة ولايات الجزائر الـ 58) *</Text>

      {/* Dropdown Trigger Button */}
      <TouchableOpacity
        style={[
          styles.dropdownTrigger,
          { backgroundColor: colors.surfaceLight, borderColor: colors.border },
          selectedWilaya && { borderColor: colors.primary, backgroundColor: 'rgba(0, 186, 102, 0.08)' },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.triggerRight}>
          <View style={[styles.pinBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={styles.pinIcon}>📍</Text>
          </View>
          <View style={styles.triggerTextCol}>
            <Text
              style={[
                styles.triggerValueText,
                { color: colors.text },
                !selectedWilaya && { color: colors.textSecondary, fontWeight: '600' },
              ]}
            >
              {selectedWilaya
                ? selectedWilaya.displayLabel
                : 'اضغط لاختيار الولاية من القائمة...'}
            </Text>
            {selectedWilaya && (
              <Text style={[styles.triggerSubText, { color: colors.primary }]}>
                {selectedWilaya.code === '00'
                  ? 'متاح للمتطوعين من جميع ولايات الوطن'
                  : `ولاية رقم ${selectedWilaya.code} (${selectedWilaya.nameEn})`}
              </Text>
            )}
          </View>
        </View>

        <View style={[styles.chevronBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chevronText, { color: colors.primary }]}>▼</Text>
        </View>
      </TouchableOpacity>

      {/* Optional Municipality / Exact Location Input */}
      {selectedWilaya && selectedWilaya.code !== '00' && (
        <View style={styles.subAddressBox}>
          <Text style={[styles.subLabel, { color: colors.textSecondary }]}>
            البلدية أو العنوان الدقيق (اختياري)
          </Text>
          <TextInput
            style={[styles.subInput, { backgroundColor: colors.surfaceLight, borderColor: colors.border, color: colors.text }]}
            placeholder={`مثال: وسط مدينة ${selectedWilaya.nameAr}، دار الشباب...`}
            placeholderTextColor={colors.textSecondary}
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
          <View style={[styles.modalSheet, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.closeBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.closeBtnText, { color: colors.textSecondary }]}>إغلاق ✕</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>اختر الولاية (58 ولاية)</Text>
            </View>

            <View style={[styles.searchBox, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="ابحث برقم الولاية أو اسمها (مثال: 09، البليدة، المدية)..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={[styles.clearSearchText, { color: colors.textSecondary }]}>✕</Text>
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
                      { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                      isSelected && { borderColor: colors.primary, backgroundColor: 'rgba(0, 186, 102, 0.14)' },
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.wilayaRowRight}>
                      <View
                        style={[
                          styles.codeBadge,
                          { backgroundColor: colors.surface, borderColor: colors.border },
                          isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                        ]}
                      >
                        <Text
                          style={[
                            styles.codeBadgeText,
                            { color: colors.primary },
                            isSelected && { color: colors.background },
                          ]}
                        >
                          {item.code === '00' ? '🌐' : item.code}
                        </Text>
                      </View>
                      <View style={styles.wilayaNamesCol}>
                        <Text
                          style={[
                            styles.wilayaNameAr,
                            { color: colors.text },
                            isSelected && { color: colors.primary },
                          ]}
                        >
                          {item.nameAr}
                        </Text>
                        <Text style={[styles.wilayaNameEn, { color: colors.textSecondary }]}>{item.nameEn}</Text>
                      </View>
                    </View>

                    {isSelected && (
                      <Text style={[styles.checkMark, { color: colors.primary }]}>✓ مختارة</Text>
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
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dropdownTrigger: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    borderWidth: 1,
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
    textAlign: 'right',
  },
  triggerSubText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 12,
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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    writingDirection: 'rtl',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    height: '80%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1.5,
    paddingTop: 18,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  closeBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    gap: 8,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    writingDirection: 'rtl',
  },
  clearSearchText: {
    fontSize: 14,
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
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBadgeText: {
    fontSize: 13.5,
    fontWeight: '900',
  },
  wilayaNamesCol: {
    alignItems: 'flex-end',
  },
  wilayaNameAr: {
    fontSize: 15,
    fontWeight: '800',
  },
  wilayaNameEn: {
    fontSize: 11.5,
  },
  checkMark: {
    fontSize: 12.5,
    fontWeight: '900',
  },
});
