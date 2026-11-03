import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
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

        <View style={styles.drawer}>
          <View style={styles.drawerTopBar}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <AppVectorIcon
                name="close"
                size={15}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>قائمة أثر</Text>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeArabic}>أثر</Text>
              </View>
            </View>
          </View>

          <View style={styles.userCard}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.userTextCol}>
              <Text style={styles.userName} numberOfLines={1}>
                {userName}
              </Text>
              {Boolean(userEmail) && (
                <Text style={styles.userEmail} numberOfLines={1}>
                  {userEmail}
                </Text>
              )}
              <View style={styles.rolePill}>
                <AppVectorIcon
                  name={isVolunteer ? 'user' : 'building'}
                  size={12}
                  color={COLORS.primary}
                />
                <Text style={styles.rolePillText}>
                  {isVolunteer ? 'حساب متطوع' : 'حساب جمعية'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.menuList}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemHighlight]}
              onPress={() => {
                onClose();
                onNavigateRank();
              }}
              activeOpacity={0.85}
            >
              <View style={styles.menuItemRight}>
                <View style={styles.iconBoxHighlight}>
                  <AppVectorIcon
                    name="trophy"
                    size={20}
                    color={COLORS.background}
                  />
                </View>
                <View style={styles.menuTextCol}>
                  <View style={styles.titleWithBadgeRow}>
                    <Text style={styles.menuTitleHighlight}>
                      لوحة الصدارة وترتيب الأثر
                    </Text>
                    <View style={styles.newPill}>
                      <Text style={styles.newPillText}>مميز</Text>
                    </View>
                  </View>
                  <Text style={styles.menuSub}>
                    ترتيبك، الأقرب لمستواك، وأبطال الأثر
                  </Text>
                </View>
              </View>
              <AppVectorIcon
                name="arrow-left"
                size={15}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            {isVolunteer && onNavigateStatsReport && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  onNavigateStatsReport();
                }}
                activeOpacity={0.85}
              >
                <View style={styles.menuItemRight}>
                  <View style={styles.iconBox}>
                    <AppVectorIcon
                      name="chart"
                      size={19}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.menuTextCol}>
                    <Text style={styles.menuTitle}>تقرير وإحصائيات أثري</Text>
                    <Text style={styles.menuSub}>
                      ساعات التطوع والمشاريع المنجزة
                    </Text>
                  </View>
                </View>
                <AppVectorIcon
                  name="arrow-left"
                  size={15}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            )}

            {isVolunteer && onNavigateMarketplace && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  onNavigateMarketplace();
                }}
                activeOpacity={0.85}
              >
                <View style={styles.menuItemRight}>
                  <View style={styles.iconBox}>
                    <AppVectorIcon
                      name="gift"
                      size={19}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.menuTextCol}>
                    <Text style={styles.menuTitle}>
                      متجر المكافآت والدورات
                    </Text>
                    <Text style={styles.menuSub}>
                      استبدل نقاط أثرك بدورات تدريبية
                    </Text>
                  </View>
                </View>
                <AppVectorIcon
                  name="arrow-left"
                  size={15}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            )}

            {onNavigateProfile && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  onNavigateProfile();
                }}
                activeOpacity={0.85}
              >
                <View style={styles.menuItemRight}>
                  <View style={styles.iconBox}>
                    <AppVectorIcon
                      name="user"
                      size={19}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.menuTextCol}>
                    <Text style={styles.menuTitle}>الملف الشخصي</Text>
                    <Text style={styles.menuSub}>
                      إدارة حسابك ومهاراتك التطوعية
                    </Text>
                  </View>
                </View>
                <AppVectorIcon
                  name="arrow-left"
                  size={15}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                onClose();
                onSignOut();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.logoutText}>تسجيل الخروج من الحساب</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>
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
    backgroundColor: 'rgba(5, 10, 8, 0.75)',
  },
  dismissArea: {
    flex: 1,
  },
  drawer: {
    width: '82%',
    maxWidth: 340,
    height: '100%',
    backgroundColor: COLORS.background,
    borderLeftWidth: 1.5,
    borderLeftColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  drawerTopBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
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
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeArabic: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.text,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  userTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  userName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  rolePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  menuList: {
    flex: 1,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemHighlight: {
    backgroundColor: 'rgba(0, 186, 102, 0.12)',
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  menuItemRight: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBoxHighlight: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
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
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
  },
  menuTitleHighlight: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'right',
  },
  newPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.background,
  },
  menuSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  footer: {
    gap: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  logoutBtn: {
    width: '100%',
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '800',
  },
  versionText: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});