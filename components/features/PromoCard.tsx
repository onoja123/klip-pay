import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context';
import { radii, spacing, fonts } from '@/constants/tokens';
import { Button } from '@/components/ui';
import { DebitCard } from './DebitCard';

const AnimatedView = Animated.View;

interface PromoCardProps {
  onPress: () => void;
}

export function PromoCard({ onPress }: PromoCardProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
    >
      <AnimatedView style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <Text style={styles.title}>Get Your Crypto Debit Card</Text>
          <Text style={styles.subtitle}>
            Spend from your wallet anywhere cards are accepted.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Create Card</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.miniCard}>
            <DebitCard />
          </View>
        </View>
      </AnimatedView>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: '#FFFFFF',
  },
  cardContainer: {
    width: 140,
    height: 100,
    justifyContent: 'center',
  },
  miniCard: {
    transform: [{ scale: 0.55 }, { rotate: '5deg' }],
    position: 'absolute',
    right: -30,
  },
});
