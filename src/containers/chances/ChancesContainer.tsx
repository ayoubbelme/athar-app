import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { chancesApi } from '../../api/chances.api';
import { volunteerHomeApi } from '../../api/volunteer-home.api';
import { extractErrorMessage } from '../../utils/error.util';
import { ProjectCategory } from '../../types/volunteer-home.types';
import { ChanceCardViewModel, SkillOption } from '../../types/chances.types';
import { COLORS } from '../../theme/colors';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { ChancesListSkeleton } from '../../components/common/AppSkeleton';
import { ChancesSearchHeader } from '../../components/chances/ChancesSearchHeader';
import { ChancesFilterBar } from '../../components/chances/ChancesFilterBar';
import { ChanceProjectCard } from '../../components/chances/ChanceProjectCard';

export const ChancesContainer: React.FC<{
  initialCategory?: ProjectCategory;
}> = ({ initialCategory }) => {
  const navigation = useNavigation<any>();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory | null>(initialCategory ?? null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [onlyOpenStatus, setOnlyOpenStatus] = useState<boolean>(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [items, setItems] = useState<ChanceCardViewModel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setDebouncedLocation(locationQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, locationQuery]);

  useEffect(() => {
    chancesApi
      .listSkills()
      .then((list) => setSkills(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, []);

  const fetchChances = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setErrorMsg(null);

      try {
        const [projectsRes, recsRes, myAppsRes] = await Promise.all([
          chancesApi.listProjects({
            page: 1,
            limit: 40,
            search: debouncedSearch,
            location: debouncedLocation,
            category: selectedCategory,
            skillId: selectedSkillId,
            status: onlyOpenStatus ? 'PUBLISHED' : null,
          }),
          volunteerHomeApi.getRecommendedProjects(50, 0).catch(() => null),
          volunteerHomeApi.getMyApplications(50).catch(() => null),
        ]);

        const scoreMap = new Map<string, number>();
        const recList = Array.isArray(recsRes?.data) ? recsRes.data : [];
        recList.forEach((r) => {
          if (r?.project?.id && r?.match) {
            scoreMap.set(r.project.id, r.match.score);
          }
        });

        const appliedSet = new Set<string>();
        const appList = Array.isArray(myAppsRes?.data) ? myAppsRes.data : [];
        appList.forEach((app) => {
          if (app?.project?.id && app.status !== 'WITHDRAWN') {
            appliedSet.add(app.project.id);
          }
        });

        const projectList = Array.isArray(projectsRes?.data)
          ? projectsRes.data
          : [];
        const viewModels: ChanceCardViewModel[] = projectList.map(
          (project) => ({
            project,
            matchScore: scoreMap.get(project.id) ?? null,
            alreadyApplied: appliedSet.has(project.id),
          }),
        );

        setItems(viewModels);
        setTotalCount(projectsRes?.meta?.total ?? viewModels.length);
      } catch (err) {
        setErrorMsg(extractErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      debouncedSearch,
      debouncedLocation,
      selectedCategory,
      selectedSkillId,
      onlyOpenStatus,
    ],
  );

  useEffect(() => {
    fetchChances();
  }, [fetchChances]);

  const handleApply = async (projectId: string) => {
    setApplyingId(projectId);
    setErrorMsg(null);
    try {
      await volunteerHomeApi.applyToProject(projectId);
      Alert.alert(
        'تم إرسال طلبك بنجاح!',
        'تم إرسال طلب التطوع الخاص بك إلى الجمعية للمراجعة.',
      );
      await fetchChances(true);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setApplyingId(null);
    }
  };

  const handleOpenDetails = (item: ChanceCardViewModel) => {
    navigation.navigate('ChanceDetails', {
      project: item.project,
      matchScore: item.matchScore,
      alreadyApplied: item.alreadyApplied,
    });
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory(null);
    setSelectedSkillId(null);
    setOnlyOpenStatus(false);
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedSkillId ? 1 : 0) +
    (locationQuery.trim() ? 1 : 0) +
    (onlyOpenStatus ? 1 : 0);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />

      <ChancesSearchHeader
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        locationQuery={locationQuery}
        onChangeLocation={setLocationQuery}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() =>
          setShowAdvancedFilters((prev) => !prev)
        }
        activeFilterCount={activeFilterCount}
        onClearAllFilters={handleClearAllFilters}
      />

      <ChancesFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        skills={skills}
        selectedSkillId={selectedSkillId}
        onSelectSkill={setSelectedSkillId}
        onlyOpenStatus={onlyOpenStatus}
        onToggleOnlyOpen={() => setOnlyOpenStatus((prev) => !prev)}
      />

      <View style={styles.resultsBar}>
        <Text style={styles.resultsCountText}>
          عدد النتائج: {totalCount} فرصة تطوعية
        </Text>
      </View>

      <View style={styles.errorWrapper}>
        <ErrorBanner message={errorMsg} />
      </View>

      {loading ? (
        <ChancesListSkeleton />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.project.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ChanceProjectCard
              item={item}
              onApply={handleApply}
              onPressDetails={handleOpenDetails}
              applyingId={applyingId}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchChances(true)}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>
                لا توجد فرص تطابق بحثك الحالي
              </Text>
              <Text style={styles.emptySubtitle}>
                جرّب تغيير كلمات البحث أو إزالة بعض الفلاتر لعرض جميع المشاريع.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  resultsBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  resultsCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
  },
  errorWrapper: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 14,
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});