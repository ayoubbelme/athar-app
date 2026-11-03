import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

const FEATURES = [
  {
    title: 'Skill-Based Smart Matching',
    subtitle:
      'Get matched with causes that fit your skills, location, and availability.',
  },
  {
    title: 'Verified Community Impact',
    subtitle:
      'Track volunteer hours, beneficiaries reached, and real local outcomes.',
  },
];

export const FeatureList: React.FC = () => (
  <View style={styles.list}>
    {FEATURES.map((item) => (
      <View key={item.title} style={styles.card}>
        <View style={styles.dot} />
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  list: { gap: 14 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: 14,
  },
  textWrapper: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
});