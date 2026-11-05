import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppVectorIcon } from '../common/AppVectorIcon';

const FULL_HADITH_TEXT =
  'أن النبي ﷺ قال: "أَحَبُّ النَّاسِ إِلَى اللهِ أَنْفَعُهُمْ لِلنَّاسِ"';

export const BrandHero: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  // Keyboard Typewriter State
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(14)).current;

  // 1. Typewriter character-by-character effect (loops with a pause after completion)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    let currentIndex = 0;
    let typingTimer: ReturnType<typeof setTimeout> | null = null;

    const typeNextChar = () => {
      if (currentIndex <= FULL_HADITH_TEXT.length) {
        setTypedText(FULL_HADITH_TEXT.slice(0, currentIndex));
        currentIndex += 1;
        typingTimer = setTimeout(typeNextChar, 55);
      } else {
        // Hold full Hadith on screen for 4.5 seconds, then replay keyboard animation
        typingTimer = setTimeout(() => {
          currentIndex = 0;
          setTypedText('');
          typeNextChar();
        }, 4500);
      }
    };

    typingTimer = setTimeout(typeNextChar, 300);

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [cardFade, cardSlide]);

  // 2. Blinking keyboard cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 480);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <View style={styles.brandSection}>
      {/* Top Theme Switch Pill on Welcome Screen */}
      <View style={styles.topSwitchRow}>
        <TouchableOpacity
          style={[
            styles.themeToggleBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primary,
            },
          ]}
          onPress={toggleTheme}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.themeDot,
              { backgroundColor: colors.primary },
            ]}
          />
          <Text style={[styles.themeToggleText, { color: colors.text }]}>
            {isDark ? 'الوضع النهاري (أبيض / أخضر)' : 'الوضع الليلي الداكن'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logo Badge */}
      <View
        style={[
          styles.logoBadge,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
          },
        ]}
      >
        <Text style={[styles.logoArabic, { color: colors.primary }]}>أثر</Text>
      </View>

      <Text style={[styles.brandTitle, { color: colors.text }]}>
        منصة أثر التطوعية
      </Text>
      <Text style={[styles.tagline, { color: colors.textSecondary }]}>
        المنصة الذكية للعمل التطوعي وصناعة الأثر المجتمعي في الجزائر
      </Text>

      {/* Hadith Card with Keyboard Typewriter Animation */}
      <Animated.View
        style={[
          styles.hadithWrapper,
          {
            opacity: cardFade,
            transform: [{ translateY: cardSlide }],
          },
        ]}
      >
        <View
          style={[
            styles.hadithCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primary,
            },
          ]}
        >
          <View style={styles.hadithHeaderRow}>
            <View
              style={[
                styles.ornamentLine,
                { backgroundColor: colors.border },
              ]}
            />
            <View style={styles.sparkleBadge}>
              <AppVectorIcon name="sparkle" size={12} color={colors.primary} />
              <Text style={[styles.hadithIntroText, { color: colors.primary }]}>
                حديث نبوي شريف
              </Text>
              <AppVectorIcon name="sparkle" size={12} color={colors.primary} />
            </View>
            <View
              style={[
                styles.ornamentLine,
                { backgroundColor: colors.border },
              ]}
            />
          </View>

          <View style={styles.typewriterBox}>
            <Text style={[styles.hadithQuoteText, { color: colors.text }]}>
              {typedText}
              <Text
                style={[
                  styles.cursorBar,
                  {
                    color: colors.primary,
                    opacity: cursorVisible ? 1 : 0,
                  },
                ]}
              >
                {' |'}
              </Text>
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  brandSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  topSwitchRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  themeToggleBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  themeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoArabic: {
    fontSize: 34,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
    maxWidth: 300,
    writingDirection: 'rtl',
  },
  hadithWrapper: {
    width: '100%',
    marginTop: 16,
  },
  hadithCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 8,
    minHeight: 104,
    justifyContent: 'center',
  },
  hadithHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
  },
  sparkleBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 186, 102, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  hadithIntroText: {
    fontSize: 12,
    fontWeight: '800',
  },
  typewriterBox: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  hadithQuoteText: {
    fontSize: 17.5,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 27,
    writingDirection: 'rtl',
  },
  cursorBar: {
    fontSize: 19,
    fontWeight: '900',
  },
});