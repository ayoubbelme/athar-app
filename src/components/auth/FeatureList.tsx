import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppVectorIcon, VectorIconName } from '../common/AppVectorIcon';

const FEATURES: Array<{
  title: string;
  subtitle: string;
  icon: VectorIconName;
}> = [
  {
    title: 'مطابقة ذكية حسب المهارات والولاية',
    subtitle:
      'نرشح لك الفرص التطوعية الأكثر توافقاً مع خبراتك، موقعك الجغرافي، وأوقات تفرغك.',
    icon: 'target',
  },
  {
    title: 'توثيق معتمد للساعات والأثر المجتمعي',
    subtitle:
      'احصل على نقاط أثر وساعات تطوع معتمدة من الجمعيات ونافس في لوحة الصدارة.',
    icon: 'trophy',
  },
];

export const FeatureList: React.FC = () => {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.list}>
      {FEATURES.map((item) => (
        <View
          key={item.title}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: isDark ? 'rgba(0,186,102,0.14)' : 'rgba(5,150,105,0.14)',
                borderColor: colors.primary,
              },
            ]}
          >
            <AppVectorIcon name={item.icon} size={18} color={colors.primary} />
          </View>
          <View style={styles.textWrapper}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: {
    flexDirection: 'row-reverse',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 15.5,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
