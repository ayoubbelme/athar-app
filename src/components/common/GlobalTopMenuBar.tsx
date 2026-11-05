import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { profileApi } from '../../api/profile.api';
import { SideBurgerMenuModal } from './SideBurgerMenuModal';
import { AppVectorIcon } from './AppVectorIcon';

interface GlobalTopMenuBarProps {
  screenTitle: string;
}

export const GlobalTopMenuBar: React.FC<GlobalTopMenuBarProps> = ({
  screenTitle,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userScore, setUserScore] = useState<number>(150);

  const fetchScore = useCallback(async () => {
    if (!user || user.role !== 'VOLUNTEER') return;
    try {
      const stats = await profileApi.getProfileStats();
      setUserScore(stats.volunteerScore);
    } catch {
      // Keep previous score on network error
    }
  }, [user]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  useFocusEffect(
    useCallback(() => {
      fetchScore();
    }, [fetchScore]),
  );

  const isVolunteer = user?.role === 'VOLUNTEER';

  return (
    <>
      <View
        style={[
          styles.barContainer,
          {
            paddingTop: Math.max(insets.top, 10),
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.innerRow}>
          {/* Right Side: Burger Menu Button + Brand & Current Screen Title */}
          <View style={styles.rightCluster}>
            <TouchableOpacity
              style={[
                styles.burgerBtn,
                {
                  backgroundColor: colors.surfaceLight,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setMenuOpen(true)}
              activeOpacity={0.8}
            >
              <View
                style={[styles.burgerLine, { backgroundColor: colors.primary }]}
              />
              <View
                style={[
                  styles.burgerLine,
                  styles.burgerLineMiddle,
                  { backgroundColor: colors.primary },
                ]}
              />
              <View
                style={[styles.burgerLine, { backgroundColor: colors.primary }]}
              />
            </TouchableOpacity>

            <View style={styles.titleCol}>
              <Text style={[styles.brandSub, { color: colors.primary }]}>
                منصة أثر • ATHAR
              </Text>
              <Text
                style={[styles.screenTitleText, { color: colors.text }]}
                numberOfLines={1}
              >
                {screenTitle}
              </Text>
            </View>
          </View>

          {/* Left Side: Theme Quick Toggle + Live User Impact Score Pill */}
          <View style={styles.leftActionsRow}>
            <TouchableOpacity
              style={[
                styles.themeIconBtn,
                {
                  backgroundColor: colors.surfaceLight,
                  borderColor: colors.border,
                },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.8}
            >
              <Text style={[styles.themeModeLabel, { color: colors.primary }]}>
                {isDark ? 'نهاري' : 'ليلي'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.scorePillBtn,
                { borderColor: colors.primary },
              ]}
              onPress={() => navigation.navigate('ImpactLeaderboard')}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.scoreStarCircle,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <AppVectorIcon
                  name="trophy"
                  size={15}
                  color={colors.primary}
                />
              </View>
              <View style={styles.scoreTextCol}>
                <Text
                  style={[styles.scoreValueText, { color: colors.primary }]}
                >
                  {isVolunteer ? `${userScore} نقطة` : 'لوحة الأثر'}
                </Text>
                <Text
                  style={[
                    styles.scoreSubLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  {isVolunteer ? 'رصيد أثرك' : 'الترتيب العام'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <SideBurgerMenuModal
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        userName={user?.name ?? 'مستخدم أثر'}
        userEmail={user?.email}
        userRole={user?.role}
        onNavigateRank={() => navigation.navigate('ImpactLeaderboard')}
        onNavigateStatsReport={() => navigation.navigate('UserStatsReport')}
        onNavigateMarketplace={() => navigation.navigate('MarketplaceRewards')}
        onNavigateProfile={() => navigation.navigate('ProfileTab')}
        onSignOut={signOut}
      />
    </>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  innerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rightCluster: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  burgerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  burgerLine: {
    width: 18,
    height: 2.2,
    borderRadius: 2,
  },
  burgerLineMiddle: {
    width: 13,
    alignSelf: 'center',
  },
  titleCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  brandSub: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  screenTitleText: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
  },
  leftActionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  themeIconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeModeLabel: {
    fontSize: 11.5,
    fontWeight: '900',
  },
  scorePillBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 7,
  },
  scoreStarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scoreTextCol: {
    alignItems: 'flex-end',
  },
  scoreValueText: {
    fontSize: 12.5,
    fontWeight: '900',
    lineHeight: 15,
  },
  scoreSubLabel: {
    fontSize: 9.5,
    fontWeight: '700',
  },
});