import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

export const BrandHero: React.FC = () => (
  <View style={styles.brandSection}>
    <View style={styles.logoBadge}>
      <Text style={styles.logoArabic}>أثر</Text>
    </View>
    <Text style={styles.brandTitle}>ATHAR</Text>
    <Text style={styles.tagline}>
      Smart Volunteering & Community Impact Platform
    </Text>
  </View>
);

const styles = StyleSheet.create({
  brandSection: {
    alignItems: 'center',
    marginTop: 28,
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoArabic: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 3,
    color: COLORS.text,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 280,
  },
});