import React from 'react';
import {
  Modal,
  Switch,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppVectorIcon } from './AppVectorIcon';

interface SideBurgerMenuModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  userRole?: string;
  onNavigateRank: () => void;
  onNavigateStatsReport?: () => void;
  onNavigateMarketplace?: () => void;
  onNavigateProfile?: () => void;
  onSignOut: () => void;
}

export const SideBurgerMenuModal: React.FC<SideBurgerMenuModalProps> = ({
  visible,
  onClose,
  userName,
  userEmail,
  userRole,
  onNavigateRank,
  onNavigateStatsReport,
  onNavigateMarketplace,
  onNavigateProfile,
  onSignOut,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();

  const initials = (userName || 'أثر')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const isVolunteer = userRole !== 'ORGANIZATION';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.background,
              borderLeftColor: colors.primary,
            },
          ]}
        >
          {/* Top Brand & Close Header */}
          <View style={styles.drawerTopBar}>
            <TouchableOpacity
              style={[
                styles.closeBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <AppVectorIcon
                name="close"
                size={15}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <Text style={[styles.brandTitle, { color: colors.text }]}>
                قائمة أثر
              </Text>
              <View
                style={[
                  styles.brandBadge,
                  { borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[styles.brandBadgeArabic, { color: colors.primary }]}
                >
                  أثر
                </Text>
              </View>
            </View>
          </View>

          {/* User Identity Card */}
          <View
            style={[
              styles.userCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.avatarRing,
                { borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {initials}
              </Text>
            </View>
            <View style={styles.userTextCol}>
              <Text
                style={[styles.userName, { color: colors.text }]}
                numberOfLines={1}
              >
                {userName}
              </Text>
              {Boolean(userEmail) && (
                <Text
                  style={[styles.userEmail, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {userEmail}
                </Text>
              )}
              <View
                style={[
                  styles.rolePill,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <AppVectorIcon
                  name={isVolunteer ? 'user' : 'building'}
                  size={12}
                  color={colors.primary}
                />
                <Text style={[styles.rolePillText, { color: colors.primary }]}>
                  {isVolunteer ? 'حساب متطوع' : 'حساب جمعية'}
                </Text>
              </View>
            </View>
          </View>

          {/* Theme Switcher Row (Dark vs White/Green) */}
          <TouchableOpacity
            style={[
              styles.themeSwitchCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
              },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.85}
          >
            <View style={styles.menuItemRight}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                  },
                ]}
              >
                <AppVectorIcon
                  name="sparkle"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  {isDark ? 'الوضع النهاري (أبيض وأخضر)' : 'الوضع الليلي الداكن'}
                </Text>
                <Text
                  style={[styles.menuSub, { color: colors.textSecondary }]}
                >
                  {isDark
                    ? 'مفعّل حالياً: المظهر الداكن'
                    : 'مفعّل حالياً: المظهر الأبيض والأخضر'}
                </Text>
              </View>
            </View>

            <Switch
              value={!isDark}
              onValueChange={() => toggleTheme()}
              trackColor={{
                false: colors.surfaceLight,
                true: 'rgba(0, 186, 102, 0.45)',
              }}
              thumbColor={colors.primary}
            />
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />

          {/* Navigation Menu Items */}
          <View style={styles.menuList}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.menuItemHighlight,
                { borderColor: colors.primary },
              ]}
              onPress={() => {
                onClose();
                onNavigateRank();
              }}
              activeOpacity={0.85}
            >
              <View style={styles.menuItemRight}>
                <View
                  style={[
                    styles.iconBoxHighlight,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <AppVectorIcon
                    name="trophy"
                    size={20}
                    color={colors.white}
                  />
                </View>
                <View style={styles.menuTextCol}>
                  <View style={styles.titleWithBadgeRow}>
                    <Text
                      style={[
                        styles.menuTitleHighlight,
                        { color: colors.primary },
                      ]}
                    >
                      لوحة الصدارة وترتيب الأثر
                    </Text>
                    <View
                      style={[
                        styles.newPill,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text
                        style={[styles.newPillText, { color: colors.white }]}
                      >
                        مميز
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.menuSub, { color: colors.textSecondary }]}
                  >
                    ترتيبك، الأقرب لمستواك، وأبطال الأثر
                  </Text>
                </View>
              </View>
              <AppVectorIcon
                name="arrow-left"
                size={15}
                color={colors.primary}
              />
            </TouchableOpacity>

            {isVolunteer && onNavigateStatsReport && (
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  onClose();
                  onNavigateStatsReport();
                }}
                activeOpacity={0.85}
              >
                <View style={styles.menuItemRight}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: colors.surfaceLight,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <AppVectorIcon
                      name="chart"
                      size={19}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.menuTextCol}>
                    <Text style={[styles.menuTitle, { color: colors.text }]}>
                      تقرير وإحصائيات أثري
                    </Text>
                    <Text
                      style={[styles.menuSub, { color: colors.textSecondary }]}
                    >
                      ساعات التطوع والمشاريع المنجزة
                    </Text>
                  </View>
                </View>
                <AppVectorIcon
                  name="arrow-left"
                  size={15}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}

            {isVolunteer && onNavigateMarketplace && (
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  onClose();
                  onNavigateMarketplace();
                }}
                activeOpacity={0.85}
              >
                <View style={styles.menuItemRight}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: colors.surfaceLight,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <AppVectorIcon
                      name="gift"
                      size={19}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.menuTextCol}>
                    <Text style={[styles.menuTitle, { color: colors.text }]}>
                      متجر المكافآت والدورات
                    </Text>
                    <Text
                      style={[styles.menuSub, { color: colors.textSecondary }]}
                    >
                      استبدل نقاط أثرك بدورات تدريبية
                    </Text>
                  </View>
                </View>
                <AppVectorIcon
                  name="arrow-left"
                  size={15}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}

            {onNavigateProfile && (
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  onClose();
                  onNavigateProfile();
                }}
                activeOpacity={0.85}
              >
                <View style={styles.menuItemRight}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: colors.surfaceLight,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <AppVectorIcon
                      name="user"
                      size={19}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.menuTextCol}>
                    <Text style={[styles.menuTitle, { color: colors.text }]}>
                      الملف الشخصي
                    </Text>
                    <Text
                      style={[styles.menuSub, { color: colors.textSecondary }]}
                    >
                      إدارة حسابك ومهاراتك التطوعية
                    </Text>
                  </View>
                </View>
                <AppVectorIcon
                  name="arrow-left"
                  size={15}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Sign Out */}
          <View
            style={[styles.footer, { borderTopColor: colors.border }]}
          >
            <TouchableOpacity
              style={[
                styles.logoutBtn,
                {
                  backgroundColor: colors.errorBg,
                  borderColor: colors.error,
                },
              ]}
              onPress={() => {
                onClose();
                onSignOut();
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.logoutText, { color: colors.error }]}>
                تسجيل الخروج من الحساب
              </Text>
            </TouchableOpacity>
            <Text
              style={[styles.versionText, { color: colors.textSecondary }]}
            >
              منصة أثر التطوعية • ATHAR v1.0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(5, 10, 8, 0.65)',
  },
  dismissArea: {
    flex: 1,
  },
  drawer: {
    width: '84%',
    maxWidth: 345,
    height: '100%',
    borderLeftWidth: 1.5,
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  drawerTopBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 186, 102, 0.16)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeArabic: {
    fontSize: 18,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '900',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '900',
  },
  userTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 12,
    textAlign: 'right',
  },
  rolePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  themeSwitchCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderWidth: 1.2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  menuList: {
    flex: 1,
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
  },
  menuItemHighlight: {
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderWidth: 1.5,
  },
  menuItemRight: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBoxHighlight: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  titleWithBadgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  menuTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    textAlign: 'right',
  },
  menuTitleHighlight: {
    fontSize: 14.5,
    fontWeight: '900',
    textAlign: 'right',
  },
  newPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newPillText: {
    fontSize: 10,
    fontWeight: '900',
  },
  menuSub: {
    fontSize: 11,
    textAlign: 'right',
  },
  footer: {
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  logoutBtn: {
    width: '100%',
    borderWidth: 1,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '800',
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
  },
});