import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ScreenLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  onBack,
  scrollable = true,
  contentStyle,
}) => {
  const { colors } = useTheme();

  const innerContent = (
    <>
      {onBack && (
        <TouchableOpacity
          style={[
            styles.backBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={onBack}
        >
          <Text style={[styles.backBtnText, { color: colors.text }]}>→ رجوع</Text>
        </TouchableOpacity>
      )}
      {children}
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentStyle]}
            keyboardShouldPersistTaps="handled"
          >
            {innerContent}
          </ScrollView>
        ) : (
          <View style={[styles.staticContent, contentStyle]}>
            {innerContent}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  backBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
