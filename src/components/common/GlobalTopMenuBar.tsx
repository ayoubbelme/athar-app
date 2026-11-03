import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../api/profile.api';
import { COLORS } from '../../theme/colors';
import { SideBurgerMenuModal } from './SideBurgerMenuModal';

interface GlobalTopMenuBarProps {
  screenTitle: string;
}

export const GlobalTopMenuBar: React.FC<GlobalTopMenuBarProps> = ({
  screenTitle,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
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
          { paddingTop: Math.max(insets.top, 10) },
        ]}
      >
        <View style={styles.innerRow}>
          {/* Right Side: Burger Menu Button + Brand & Current Screen Title */}
          <View style={styles.rightCluster}>
            <TouchableOpacity
              style={styles.burgerBtn}
              onPress={() => setMenuOpen(true)}
              activeOpacity={0.8}
            >
              <View style={styles.burgerLine} />
              <View style={[styles.burgerLine, styles.burgerLineMiddle]} />
              <View style={styles.burgerLine} />
            </TouchableOpacity>

            <View style={styles.titleCol}>
              <Text style={styles.brandSub}>منصة أثر • ATHAR</Text>
              <Text style={styles.screenTitleText} numberOfLines={1}>
                {screenTitle}
              </Text>
            </View>
          </View>

          {/* Left Side: Live User Impact Score Badge (tappable to view Leaderboard) */}
          <TouchableOpacity
            style={styles.scorePillBtn}
            onPress={() => navigation.navigate('ImpactLeaderboard')}
            activeOpacity={0.85}
          >
            <View style={styles.scoreStarCircle}>
              <Text style={styles.scoreStarIcon}>⭐</Text>
            </View>
            <View style={styles.scoreTextCol}>
              <Text style={styles.scoreValueText}>
                {isVolunteer ? `${userScore} نقطة` : 'لوحة الأثر'}
              </Text>
              <Text style={styles.scoreSubLabel}>
                {isVolunteer ? 'رصيد أثرك' : 'الترتيب العام'}
              </Text>
            </View>
          </TouchableOpacity>
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
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  innerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rightCluster: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  burgerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  burgerLine: {
    width: 18,
    height: 2.2,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
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
    color: COLORS.primary,
  },
  screenTitleText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'right',
  },
  scorePillBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 8,
  },
  scoreStarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreStarIcon: {
    fontSize: 13,
  },
  scoreTextCol: {
    alignItems: 'flex-end',
  },
  scoreValueText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 16,
  },
  scoreSubLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});