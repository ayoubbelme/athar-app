import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { organizationApi } from '../../api/organization.api';
import { chancesApi } from '../../api/chances.api';
import { extractErrorMessage } from '../../utils/error.util';
import { Availability } from '../../types/auth.types';
import {
  ProjectCategory,
  ProjectStatus,
} from '../../types/volunteer-home.types';
import { SkillOption } from '../../types/chances.types';
import {
  ALL_PROJECT_CATEGORIES,
  translateCategory,
} from '../../utils/arabic.util';
import {
  ALGERIA_WILAYAS,
  WilayaOption,
} from '../../utils/algeria-wilayas.util';
import { useTheme } from '../../context/ThemeContext';
import { ThemePalette } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
// 👇 Imported here
import { WilayaDropdownPicker } from '../../components/organization/WilayaDropdownPicker';

const VOLUNTEER_COUNT_PRESETS = [5, 10, 15, 25, 50, 100];

const AVAILABILITY_CARDS: Array<{
  value: Availability;
  title: string;
  subtitle: string;
  icon: string;
}> = [
  {
    value: 'WEEKENDS',
    title: 'عطلة نهاية الأسبوع',
    subtitle: 'الجمعة والسبت',
    icon: '🌤️',
  },
  {
    value: 'WEEKDAYS',
    title: 'أيام الأسبوع',
    subtitle: 'الأحد إلى الخميس',
    icon: '📅',
  },
  {
    value: 'EVENINGS',
    title: 'الفترة المسائية',
    subtitle: 'بعد الساعة 16:00',
    icon: '🌙',
  },
  {
    value: 'FLEXIBLE',
    title: 'وقت مرن / حر',
    subtitle: 'حسب تفرغ المتطوع',
    icon: '⚡',
  },
];

const TIME_SHIFT_OPTIONS = [
  { id: 'MORNING', label: '☀️ الفترة الصباحية (08:00 - 12:00)' },
  { id: 'AFTERNOON', label: '🌤️ الفترة المسائية (13:00 - 17:00)' },
  { id: 'FULL_DAY', label: '🕘 يوم كامل (09:00 - 16:00)' },
  { id: 'FLEXIBLE_HOURS', label: '⏱️ ساعات مرنة عن بُعد' },
];

const DAILY_HOURS_PRESETS = [2, 4, 6, 8];

interface SelectedSkillConfig {
  skillId: string;
  name: string;
  importance: number; // 1 = إضافية, 3 = مهمة, 5 = أساسية
  requiredCount: number;
  isCustom?: boolean;
}

function getFutureDateIso(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const PostChanceContainer: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // 1. Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 2. Multi-Select Categories + Custom Categories ("أخرى")
  const [selectedCategories, setSelectedCategories] = useState<
    ProjectCategory[]
  >(['COMMUNITY']);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryDraft, setCustomCategoryDraft] = useState('');

  // 3. Wilaya Dropdown + Address Detail & Volunteer Capacity UX
  const [selectedWilaya, setSelectedWilaya] = useState<WilayaOption | null>(
    ALGERIA_WILAYAS.find((w) => w.code === '09') ?? ALGERIA_WILAYAS[0],
  );
  const [addressDetail, setAddressDetail] = useState('');
  const [isUnlimitedVolunteers, setIsUnlimitedVolunteers] = useState(false);
  const [maxVolunteersInput, setMaxVolunteersInput] = useState<string>('15');

  // 4. Time, Schedule & Availability UX
  const [selectedDurationPreset, setSelectedDurationPreset] =
    useState<string>('WEEK');
  const [startDate, setStartDate] = useState(getFutureDateIso(3));
  const [endDate, setEndDate] = useState(getFutureDateIso(10));
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<
    Availability[]
  >(['WEEKENDS']);
  const [selectedShiftId, setSelectedShiftId] = useState<string>('MORNING');
  const [hoursPerDay, setHoursPerDay] = useState<number>(4);

 // State for Skills + Custom Skills ("أخرى / إضافة مهارة مخصصة")
  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, SelectedSkillConfig>
  >({});
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [customSkillDraft, setCustomSkillDraft] = useState('');

  const handleAddCustomSkill = () => {
    const trimmed = customSkillDraft.trim();
    if (!trimmed) return;

    // If the typed skill matches an existing backend skill name, select that skill
    const existingApiSkill = availableSkills.find(
      (s) => s.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (existingApiSkill) {
      setSelectedSkills((prev) => ({
        ...prev,
        [existingApiSkill.id]: {
          skillId: existingApiSkill.id,
          name: existingApiSkill.name,
          importance: 3,
          requiredCount: 2,
          isCustom: false,
        },
      }));
      setCustomSkillDraft('');
      return;
    }

    const customId = `custom-${trimmed}`;
    setSelectedSkills((prev) => ({
      ...prev,
      [customId]: {
        skillId: customId,
        name: trimmed,
        importance: 3,
        requiredCount: 2,
        isCustom: true,
      },
    }));
    setCustomSkillDraft('');
  };

  const removeSelectedSkill = (skillId: string) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      delete next[skillId];
      return next;
    });
  };

  // 6. Publish Mode
  const [publishStatus, setPublishStatus] =
    useState<Extract<ProjectStatus, 'PUBLISHED' | 'DRAFT'>>('PUBLISHED');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    chancesApi
      .listSkills()
      .then((list) => setAvailableSkills(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, []);

  const toggleCategory = (cat: ProjectCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryDraft.trim();
    if (!trimmed) return;
    if (!customCategories.includes(trimmed)) {
      setCustomCategories((prev) => [...prev, trimmed]);
    }
    setCustomCategoryDraft('');
  };

  const removeCustomCategory = (label: string) => {
    setCustomCategories((prev) => prev.filter((item) => item !== label));
  };

  const parsedVolunteersCount = Math.max(
    1,
    parseInt(maxVolunteersInput || '0', 10) || 1,
  );

  const handleStepVolunteers = (delta: number) => {
    setIsUnlimitedVolunteers(false);
    const nextVal = Math.max(1, Math.min(1000, parsedVolunteersCount + delta));
    setMaxVolunteersInput(String(nextVal));
  };

  const handleSelectVolunteerPreset = (count: number) => {
    setIsUnlimitedVolunteers(false);
    setMaxVolunteersInput(String(count));
  };

  const toggleAvailability = (item: Availability) => {
    setSelectedAvailabilities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
  };

  const applySchedulePreset = (
    presetKey: string,
    startOffsetDays: number,
    durationDays: number,
  ) => {
    setSelectedDurationPreset(presetKey);
    setStartDate(getFutureDateIso(startOffsetDays));
    setEndDate(getFutureDateIso(startOffsetDays + durationDays));
  };

  const toggleSkill = (skill: SkillOption) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      if (next[skill.id]) {
        delete next[skill.id];
      } else {
        next[skill.id] = {
          skillId: skill.id,
          name: skill.name,
          importance: 3,
          requiredCount: 2,
        };
      }
      return next;
    });
  };

  const updateSkillImportance = (skillId: string, importance: number) => {
    setSelectedSkills((prev) => {
      if (!prev[skillId]) return prev;
      return {
        ...prev,
        [skillId]: {
          ...prev[skillId],
          importance,
        },
      };
    });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedCategories(['COMMUNITY']);
    setCustomCategories([]);
    setCustomCategoryDraft('');
    setShowCustomCategoryInput(false);
    setSelectedWilaya(
      ALGERIA_WILAYAS.find((w) => w.code === '09') ?? ALGERIA_WILAYAS[0],
    );
    setAddressDetail('');
    setIsUnlimitedVolunteers(false);
    setMaxVolunteersInput('15');
    setSelectedDurationPreset('WEEK');
    setStartDate(getFutureDateIso(3));
    setEndDate(getFutureDateIso(10));
    setSelectedAvailabilities(['WEEKENDS']);
    setSelectedShiftId('MORNING');
    setHoursPerDay(4);
    setSelectedSkills({});
    setPublishStatus('PUBLISHED');
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || title.trim().length < 4) {
      setErrorMsg('يرجى إدخال عنوان واضح للفرصة التطوعية (4 أحرف على الأقل).');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg(
        'يرجى كتابة وصف تفصيلي للمهام والأهداف المطلوبة (10 أحرف على الأقل).',
      );
      return;
    }

    const finalCustomCategories = [...customCategories];
    if (
      customCategoryDraft.trim() &&
      !finalCustomCategories.includes(customCategoryDraft.trim())
    ) {
      finalCustomCategories.push(customCategoryDraft.trim());
    }

    if (selectedCategories.length === 0 && finalCustomCategories.length === 0) {
      setErrorMsg(
        'يرجى اختيار مجال واحد على الأقل أو كتابة تصنيف مخصص للفرصة التطوعية.',
      );
      return;
    }

    if (!selectedWilaya) {
      setErrorMsg('يرجى اختيار الولاية من القائمة.');
      return;
    }

    if (selectedAvailabilities.length === 0) {
      setErrorMsg('يرجى اختيار وقت واحد على الأقل من أوقات التطوع المناسبة.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const skillsPayload = Object.values(selectedSkills).map((s) => ({
        skillId: s.skillId,
        requiredCount: s.requiredCount,
        importance: s.importance,
      }));

      const primaryCategory: ProjectCategory =
        selectedCategories[0] ?? 'COMMUNITY';

      // Compose clean location string from selected Wilaya + optional municipality
      const formattedLocation =
        selectedWilaya.code === '00'
          ? 'عن بُعد / أونلاين'
          : addressDetail.trim()
          ? `${selectedWilaya.nameAr} - ${addressDetail.trim()}`
          : selectedWilaya.nameAr;

      const shiftObj = TIME_SHIFT_OPTIONS.find((s) => s.id === selectedShiftId);
      const allCategoryLabels = [
        ...selectedCategories.map((c) => translateCategory(c)),
        ...finalCustomCategories,
      ];

      const extraDetailsLines: string[] = [];
      if (allCategoryLabels.length > 1 || finalCustomCategories.length > 0) {
        extraDetailsLines.push(
          `• المجالات والتصنيفات: ${allCategoryLabels.join('، ')}`,
        );
      }
      if (shiftObj) {
        extraDetailsLines.push(
          `• توقيت النشاط: ${shiftObj.label} (حوالي ${hoursPerDay} ساعات يومياً)`,
        );
      }

      const finalDescription =
        extraDetailsLines.length > 0
          ? `${description.trim()}\n\n${extraDetailsLines.join('\n')}`
          : description.trim();

      await organizationApi.createProject({
        title: title.trim(),
        description: finalDescription,
        category: primaryCategory,
        categories: selectedCategories,
        customCategories: finalCustomCategories,
        location: formattedLocation,
        maxVolunteers: isUnlimitedVolunteers ? null : parsedVolunteersCount,
        startDate: startDate.trim() ? startDate.trim() : null,
        endDate: endDate.trim() ? endDate.trim() : null,
        availability: selectedAvailabilities,
        status: publishStatus,
        skills: skillsPayload,
      });

      const isPublished = publishStatus === 'PUBLISHED';
      Alert.alert(
        isPublished ? 'تم نشر الفرصة التطوعية بنجاح! 🎉' : 'تم حفظ المسودة 📁',
        isPublished
          ? 'أصبحت الفرصة التطوعية متاحة الآن للمتطوعين للتقديم عليها، وسيتم مطابقتها مع أصحاب المهارات.'
          : 'تم حفظ الفرصة كمسودة. يمكنك نشرها في أي وقت من لوحة تحكم الجمعية.',
        [
          {
            text: 'الذهاب إلى لوحة الجمعية',
            onPress: () => {
              resetForm();
              navigation.navigate('HomeTab');
            },
          },
          {
            text: 'إضافة فرصة أخرى',
            style: 'cancel',
            onPress: () => resetForm(),
          },
        ],
      );
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSkillList = Object.values(selectedSkills);
  const totalSelectedCategoriesCount =
    selectedCategories.length + customCategories.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Executive Bar */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            style={styles.resetTopBtn}
            onPress={resetForm}
            activeOpacity={0.8}
          >
            <Text style={styles.resetTopBtnText}>إفراغ الحقول</Text>
          </TouchableOpacity>

          <View style={styles.topTitleCol}>
            <Text style={styles.headerTitle}>إنشاء فرصة تطوعية جديدة ✨</Text>
            <Text style={styles.headerSub}>
              انشر مبادرتك واستقطب المتطوعين الأكثر توافقاً مع مهارات مشروعك
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ErrorBanner message={errorMsg} />

          {/* Section 1: Basic Opportunity Details */}
          <View style={styles.formCard}>
            <View style={styles.cardSectionHeader}>
              <Text style={styles.stepBadge}>1</Text>
              <Text style={styles.sectionTitle}>المعلومات الأساسية للفرصة</Text>
            </View>

            <Text style={styles.label}>عنوان الفرصة التطوعية *</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: تنظيم قافلة طبية وتوعوية بولاية البليدة"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
            />

            <Text style={styles.label}>الوصف التفصيلي والمهام المطلوبة *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="اشرح أهداف المبادرة، المهام اليومية للمتطوعين، والفئة المستهدفة..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              textAlign="right"
            />
          </View>

          {/* Section 2: Multi-Select Project Categories + Custom Category Input */}
          <View style={styles.formCard}>
            <View style={styles.cardSectionHeader}>
              <Text style={styles.stepBadge}>2</Text>
              <Text style={styles.sectionTitle}>
                المجال والتصنيف ({totalSelectedCategoriesCount} مختار)
              </Text>
            </View>

            <Text style={styles.helperText}>
              يمكنك اختيار أكثر من مجال واحد، أو الضغط على "أخرى" لإضافة تصنيف
              جديد خاص بمبادرتك:
            </Text>

            <View style={styles.chipsWrap}>
              {ALL_PROJECT_CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleCategory(cat)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {active
                        ? `✓ ${translateCategory(cat)}`
                        : translateCategory(cat)}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom Categories Added by the Organization */}
              {customCategories.map((customCat) => (
                <TouchableOpacity
                  key={customCat}
                  style={[styles.chip, styles.chipActive]}
                  onPress={() => removeCustomCategory(customCat)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, styles.chipTextActive]}>
                    ✓ {customCat} ✕
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Toggle Button to Write Custom Choice */}
              <TouchableOpacity
                style={[
                  styles.chip,
                  styles.otherChipBtn,
                  showCustomCategoryInput && styles.chipActive,
                ]}
                onPress={() => setShowCustomCategoryInput((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.chipText,
                    styles.otherChipText,
                    showCustomCategoryInput && styles.chipTextActive,
                  ]}
                >
                  + أخرى (إضافة تصنيف)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Expandable Custom Category Input Row */}
            {showCustomCategoryInput && (
              <View style={styles.customCatRow}>
                <TouchableOpacity
                  style={[
                    styles.addCustomCatBtn,
                    !customCategoryDraft.trim() && styles.btnDisabled,
                  ]}
                  onPress={handleAddCustomCategory}
                  disabled={!customCategoryDraft.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addCustomCatBtnText}>إضافة +</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.customCatInput}
                  placeholder="اكتب مجالاً أو تصنيفاً آخر (مثال: الإغاثة العاجلة)..."
                  placeholderTextColor={colors.textSecondary}
                  value={customCategoryDraft}
                  onChangeText={setCustomCategoryDraft}
                  onSubmitEditing={handleAddCustomCategory}
                  returnKeyType="done"
                  textAlign="right"
                />
              </View>
            )}
          </View>

          {/* Section 3: Location (58 Wilayas Dropdown) & Volunteer Capacity UX */}
          <View style={styles.formCard}>
            <View style={styles.cardSectionHeader}>
              <Text style={styles.stepBadge}>3</Text>
              <Text style={styles.sectionTitle}>الموقع وعدد المتطوعين</Text>
            </View>

            {/* 👇 CALLED HERE: Searchable 58 Wilayas Dropdown Picker */}
            <WilayaDropdownPicker
              selectedWilaya={selectedWilaya}
              onSelectWilaya={setSelectedWilaya}
              addressDetail={addressDetail}
              onChangeAddressDetail={setAddressDetail}
            />

            <View style={styles.divider} />

            {/* Improved Volunteer Capacity Selector */}
            <View style={styles.capacityHeaderRow}>
              <TouchableOpacity
                style={[
                  styles.unlimitedTogglePill,
                  isUnlimitedVolunteers && styles.unlimitedTogglePillActive,
                ]}
                onPress={() => setIsUnlimitedVolunteers((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.unlimitedToggleText,
                    isUnlimitedVolunteers && styles.unlimitedToggleTextActive,
                  ]}
                >
                  {isUnlimitedVolunteers
                    ? '✓ عدد مفتوح (غير محدود)'
                    : '♾️ جعل العدد مفتوحاً'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>عدد المتطوعين المطلوبين</Text>
            </View>

            {isUnlimitedVolunteers ? (
              <View style={styles.unlimitedBanner}>
                <Text style={styles.unlimitedBannerTitle}>
                  ♾️ باب التقديم مفتوح لعدد غير محدود من المتطوعين
                </Text>
                <Text style={styles.unlimitedBannerSub}>
                  مناسب للحملات الكبرى والمبادرات المفتوحة للجميع
                </Text>
              </View>
            ) : (
              <View style={styles.capacityControlContainer}>
                {/* Quick Number Presets */}
                <Text style={styles.subLabel}>اختيار سريع للعدد:</Text>
                <View style={styles.presetNumbersRow}>
                  {VOLUNTEER_COUNT_PRESETS.map((preset) => {
                    const isSelected = parsedVolunteersCount === preset;
                    return (
                      <TouchableOpacity
                        key={preset}
                        style={[
                          styles.numPresetChip,
                          isSelected && styles.numPresetChipActive,
                        ]}
                        onPress={() => handleSelectVolunteerPreset(preset)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.numPresetText,
                            isSelected && styles.numPresetTextActive,
                          ]}
                        >
                          {preset}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Direct Numeric Input + Smooth Stepper Card */}
                <View style={styles.modernCounterCard}>
                  <TouchableOpacity
                    style={styles.counterRoundBtn}
                    onPress={() => handleStepVolunteers(1)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.counterRoundBtnText}>+</Text>
                  </TouchableOpacity>

                  <View style={styles.counterCenterBox}>
                    <TextInput
                      style={styles.counterDirectInput}
                      value={maxVolunteersInput}
                      onChangeText={(txt) =>
                        setMaxVolunteersInput(txt.replace(/[^0-9]/g, ''))
                      }
                      keyboardType="number-pad"
                      maxLength={4}
                      textAlign="center"
                    />
                    <Text style={styles.counterUnitLabel}>متطوع مطلوب</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.counterRoundBtn}
                    onPress={() => handleStepVolunteers(-1)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.counterRoundBtnText}>−</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Section 4: Enhanced Time, Schedule & Availability UX */}
          <View style={styles.formCard}>
            <View style={styles.cardSectionHeader}>
              <Text style={styles.stepBadge}>4</Text>
              <Text style={styles.sectionTitle}>توقيت ومدة التطوع</Text>
            </View>

            {/* 4.A: Quick Duration & Date Presets */}
            <Text style={styles.label}>المدة الزمنية للمبادرة</Text>
            <View style={styles.durationCardsGrid}>
              {[
                {
                  key: 'ONE_DAY',
                  title: 'يوم واحد',
                  sub: 'نشاط سريع',
                  icon: '⚡',
                  offset: 2,
                  days: 1,
                },
                {
                  key: 'WEEKEND',
                  title: 'نهاية الأسبوع',
                  sub: 'الجمعة والسبت',
                  icon: '🌤️',
                  offset: 3,
                  days: 2,
                },
                {
                  key: 'WEEK',
                  title: 'أسبوع كامل',
                  sub: '7 أيام عمل',
                  icon: '📅',
                  offset: 5,
                  days: 7,
                },
                {
                  key: 'MONTH',
                  title: 'شهر كامل',
                  sub: 'مشروع مستمر',
                  icon: '🗓️',
                  offset: 7,
                  days: 30,
                },
              ].map((dItem) => {
                const isSelected = selectedDurationPreset === dItem.key;
                return (
                  <TouchableOpacity
                    key={dItem.key}
                    style={[
                      styles.durationCard,
                      isSelected && styles.durationCardActive,
                    ]}
                    onPress={() =>
                      applySchedulePreset(dItem.key, dItem.offset, dItem.days)
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.durationIcon}>{dItem.icon}</Text>
                    <Text
                      style={[
                        styles.durationTitle,
                        isSelected && styles.durationTitleActive,
                      ]}
                    >
                      {dItem.title}
                    </Text>
                    <Text style={styles.durationSub}>{dItem.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Start & End Date Inputs */}
            <View style={styles.rowInputs}>
              <View style={styles.halfCol}>
                <Text style={styles.subLabel}>📅 تاريخ البداية</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  value={startDate}
                  onChangeText={(t) => {
                    setSelectedDurationPreset('CUSTOM');
                    setStartDate(t);
                  }}
                  textAlign="center"
                />
              </View>

              <View style={styles.halfCol}>
                <Text style={styles.subLabel}>🏁 تاريخ النهاية</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  value={endDate}
                  onChangeText={(t) => {
                    setSelectedDurationPreset('CUSTOM');
                    setEndDate(t);
                  }}
                  textAlign="center"
                />
              </View>
            </View>

            <View style={styles.divider} />

            {/* 4.B: Days / Availability Visual Cards */}
            <Text style={styles.label}>
              أيام التفرغ المطلوبة (يمكن اختيار أكثر من وقت) *
            </Text>
            <View style={styles.availabilityGrid}>
              {AVAILABILITY_CARDS.map((avCard) => {
                const active = selectedAvailabilities.includes(avCard.value);
                return (
                  <TouchableOpacity
                    key={avCard.value}
                    style={[
                      styles.availCard,
                      active && styles.availCardActive,
                    ]}
                    onPress={() => toggleAvailability(avCard.value)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.availCardTop}>
                      <Text style={styles.availCardIcon}>{avCard.icon}</Text>
                      {active && (
                        <View style={styles.availCheckBadge}>
                          <Text style={styles.availCheckText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.availCardTitle,
                        active && styles.availCardTitleActive,
                      ]}
                    >
                      {avCard.title}
                    </Text>
                    <Text style={styles.availCardSub}>{avCard.subtitle}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* 4.C: Shift Time of Day & Daily Hours */}
            <Text style={styles.label}>الفترة اليومية وعدد الساعات التقديري</Text>
            <View style={styles.shiftsColumn}>
              {TIME_SHIFT_OPTIONS.map((shift) => {
                const active = selectedShiftId === shift.id;
                return (
                  <TouchableOpacity
                    key={shift.id}
                    style={[
                      styles.shiftRowBtn,
                      active && styles.shiftRowBtnActive,
                    ]}
                    onPress={() => setSelectedShiftId(shift.id)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.shiftRowText,
                        active && styles.shiftRowTextActive,
                      ]}
                    >
                      {shift.label}
                    </Text>
                    <View
                      style={[
                        styles.radioCircle,
                        active && styles.radioCircleActive,
                      ]}
                    >
                      {active && <View style={styles.radioInnerDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Daily Hours Pills */}
            <View style={styles.dailyHoursRow}>
              <View style={styles.hoursPillsWrap}>
                {DAILY_HOURS_PRESETS.map((h) => {
                  const active = hoursPerDay === h;
                  return (
                    <TouchableOpacity
                      key={h}
                      style={[
                        styles.hourPill,
                        active && styles.hourPillActive,
                      ]}
                      onPress={() => setHoursPerDay(h)}
                    >
                      <Text
                        style={[
                          styles.hourPillText,
                          active && styles.hourPillTextActive,
                        ]}
                      >
                        {h} ساعات
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.subLabel}>معدل الساعات في اليوم:</Text>
            </View>
          </View>

          {/* Section 5: Skills & Matching Importance + Custom Skill Option ("+ أخرى") */}
          <View style={styles.formCard}>
            <View style={styles.cardSectionHeader}>
              <Text style={styles.stepBadge}>5</Text>
              <Text style={styles.sectionTitle}>
                المهارات المطلوبة للمطابقة الذكية ({selectedSkillList.length})
              </Text>
            </View>

            <Text style={styles.helperText}>
              اختر المهارات المطلوبة من القائمة أو اضغط على "+ أخرى (إضافة مهارة)"
              لكتابة مهارة جديدة:
            </Text>

            <View style={styles.chipsWrap}>
              {/* Predefined API Skills */}
              {availableSkills.map((sk) => {
                const active = Boolean(selectedSkills[sk.id]);
                return (
                  <TouchableOpacity
                    key={sk.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleSkill(sk)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {active ? `✓ ${sk.name}` : `+ ${sk.name}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom Skills Added by the Organization */}
              {selectedSkillList.map((cSkill: SelectedSkillConfig) => (
                <TouchableOpacity
                  key={cSkill.skillId}
                  style={[styles.chip, styles.chipActive]}
                  onPress={() => removeSelectedSkill(cSkill.skillId)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, styles.chipTextActive]}>
                    ✓ {cSkill.name} ✕
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Toggle Button to Write Custom Skill */}
              <TouchableOpacity
                style={[
                  styles.chip,
                  styles.otherChipBtn,
                  showCustomSkillInput && styles.chipActive,
                ]}
                onPress={() => setShowCustomSkillInput((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.chipText,
                    styles.otherChipText,
                    showCustomSkillInput && styles.chipTextActive,
                  ]}
                >
                  + أخرى (إضافة مهارة)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Expandable Custom Skill Input Row */}
            {showCustomSkillInput && (
              <View style={styles.customCatRow}>
                <TouchableOpacity
                  style={[
                    styles.addCustomCatBtn,
                    !customSkillDraft.trim() && styles.btnDisabled,
                  ]}
                  onPress={handleAddCustomSkill}
                  disabled={!customSkillDraft.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addCustomCatBtnText}>إضافة +</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.customCatInput}
                  placeholder="اكتب مهارة أخرى مطلوبة (مثال: التصوير الفوتوغرافي، الإسعافات الأولية)..."
                  placeholderTextColor={colors.textSecondary}
                  value={customSkillDraft}
                  onChangeText={setCustomSkillDraft}
                  onSubmitEditing={handleAddCustomSkill}
                  returnKeyType="done"
                  textAlign="right"
                />
              </View>
            )}

            {/* Importance Level Configurator for All Selected Skills (API + Custom) */}
            {selectedSkillList.length > 0 && (
              <View style={styles.selectedSkillsBox}>
                <Text style={styles.subLabel}>
                  درجة أهمية كل مهارة في حساب نسبة التوافق:
                </Text>
                {selectedSkillList.map((item) => (
                  <View key={item.skillId} style={styles.skillConfigRow}>
                    <View style={styles.skillNameAndRemoveRow}>
                      <TouchableOpacity
                        onPress={() => removeSelectedSkill(item.skillId)}
                        style={styles.removeSkillIconBtn}
                      >
                        <Text style={styles.removeSkillIconText}>✕</Text>
                      </TouchableOpacity>
                      <Text style={styles.skillConfigName}>
                        {item.name} {item.isCustom ? '(مخصصة)' : ''}
                      </Text>
                    </View>

                    <View style={styles.importanceBtnsRow}>
                      {[
                        { label: 'إضافية', val: 1 },
                        { label: 'مهمة', val: 3 },
                        { label: 'أساسية', val: 5 },
                      ].map((lvl) => {
                        const isSel = item.importance === lvl.val;
                        return (
                          <TouchableOpacity
                            key={lvl.val}
                            style={[
                              styles.impPill,
                              isSel && styles.impPillActive,
                            ]}
                            onPress={() =>
                              updateSkillImportance(item.skillId, lvl.val)
                            }
                          >
                            <Text
                              style={[
                                styles.impPillText,
                                isSel && styles.impPillTextActive,
                              ]}
                            >
                              {lvl.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Section 6: Publish Status Mode (Immediate vs Draft) */}
          <View style={styles.formCard}>
            <Text style={styles.label}>حالة النشر</Text>
            <View style={styles.statusToggleRow}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  publishStatus === 'PUBLISHED' && styles.statusOptionActive,
                ]}
                onPress={() => setPublishStatus('PUBLISHED')}
              >
                <Text
                  style={[
                    styles.statusOptionTitle,
                    publishStatus === 'PUBLISHED' &&
                      styles.statusOptionTitleActive,
                  ]}
                >
                  🚀 نشر فوري للمتطوعين
                </Text>
                <Text style={styles.statusOptionSub}>
                  تظهر الفرصة مباشرة في نتائج البحث والترشيحات
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusOption,
                  publishStatus === 'DRAFT' && styles.statusOptionActive,
                ]}
                onPress={() => setPublishStatus('DRAFT')}
              >
                <Text
                  style={[
                    styles.statusOptionTitle,
                    publishStatus === 'DRAFT' &&
                      styles.statusOptionTitleActive,
                  ]}
                >
                  📁 حفظ كمسودة
                </Text>
                <Text style={styles.statusOptionSub}>
                  حفظ المشروع للمراجعة قبل فتح باب التقديم
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit CTA Button */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text style={[styles.submitBtnText, { color: colors.background }]}>
                {publishStatus === 'PUBLISHED'
                  ? 'نشر الفرصة التطوعية الآن ✨'
                  : 'حفظ الفرصة كمسودة 📁'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  topHeaderBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  topTitleCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  resetTopBtn: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  resetTopBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    alignItems: 'flex-end',
  },
  cardSectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginBottom: 2,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  label: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 18,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    writingDirection: 'rtl',
  },
  textArea: {
    minHeight: 110,
  },
  otherChipBtn: {
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  otherChipText: {
    color: colors.primary,
  },
  customCatRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  customCatInput: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: colors.text,
    writingDirection: 'rtl',
  },
  addCustomCatBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCustomCatBtnText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  capacityHeaderRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unlimitedTogglePill: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  unlimitedTogglePillActive: {
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderColor: colors.primary,
  },
  unlimitedToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  unlimitedToggleTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  unlimitedBanner: {
    width: '100%',
    backgroundColor: 'rgba(0, 186, 102, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  unlimitedBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  unlimitedBannerSub: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  capacityControlContainer: {
    width: '100%',
    gap: 10,
    alignItems: 'flex-end',
  },
  presetNumbersRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
  },
  numPresetChip: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numPresetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  numPresetText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  numPresetTextActive: {
    color: colors.background,
  },
  modernCounterCard: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterRoundBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterRoundBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    lineHeight: 24,
  },
  counterCenterBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterDirectInput: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    paddingVertical: 0,
    minWidth: 70,
  },
  counterUnitLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  durationCardsGrid: {
    width: '100%',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: 'flex-end',
    gap: 3,
  },
  durationCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
  },
  durationIcon: {
    fontSize: 18,
  },
  durationTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  durationTitleActive: {
    color: colors.primary,
  },
  durationSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  rowInputs: {
    width: '100%',
    flexDirection: 'row-reverse',
    gap: 10,
  },
  halfCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
  },
  dateInput: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  availabilityGrid: {
    width: '100%',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  availCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: 'flex-end',
    gap: 4,
  },
  availCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
  },
  availCardTop: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availCardIcon: {
    fontSize: 18,
  },
  availCheckBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availCheckText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.background,
  },
  availCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  availCardTitleActive: {
    color: colors.primary,
  },
  availCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  shiftsColumn: {
    width: '100%',
    gap: 8,
  },
  shiftRowBtn: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  shiftRowBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
  },
  shiftRowText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  shiftRowTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  dailyHoursRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  hoursPillsWrap: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  hourPill: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  hourPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  hourPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  hourPillTextActive: {
    color: colors.background,
    fontWeight: '800',
  },
  chipsWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
  },
  selectedSkillsBox: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginTop: 4,
    alignItems: 'flex-end',
  },
  skillConfigRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  skillNameAndRemoveRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  removeSkillIconBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSkillIconText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#d14343',
    lineHeight: 14,
  },
  skillConfigName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  importanceBtnsRow: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  impPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  impPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  impPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  impPillTextActive: {
    color: colors.background,
    fontWeight: '800',
  },
  statusToggleRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    gap: 10,
  },
  statusOption: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: 'flex-end',
    gap: 4,
  },
  statusOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
  },
  statusOptionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
  },
  statusOptionTitleActive: {
    color: colors.primary,
  },
  statusOptionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 16,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '900',
  },
});