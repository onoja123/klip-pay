import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, typography, radii, spacing, shadows } from '@/constants/tokens';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface DebitCardProps {
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  status?: 'active' | 'frozen' | 'pending';
  onPress?: () => void;
  showDetails?: boolean;
}

export function DebitCard({
  last4 = '••••',
  expiryMonth,
  expiryYear,
  status = 'pending',
  onPress,
  showDetails = false,
}: DebitCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={!onPress}
      style={[styles.container, animatedStyle]}
    >
      <LinearGradient
        colors={['#2A2A2A', '#1A1A1A', '#0F0F0F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Topographic pattern overlay */}
        <View style={styles.patternOverlay}>
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.patternLine,
                {
                  top: 30 + i * 35,
                  left: -50 + i * 20,
                  width: 300 + i * 30,
                  height: 300 + i * 30,
                },
              ]}
            />
          ))}
        </View>

        {/* Card content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.brand}>klip.</Text>
            <Text style={styles.cardType}>DEBIT CARD</Text>
          </View>

          <View style={styles.middleSection}>
            {showDetails && (
              <Text style={styles.cardNumber}>
                •••• •••• •••• {last4}
              </Text>
            )}
          </View>

          <View style={styles.bottomRow}>
            {showDetails && expiryMonth && expiryYear && (
              <View style={styles.expiryContainer}>
                <Text style={styles.expiryLabel}>VALID THRU</Text>
                <Text style={styles.expiry}>
                  {String(expiryMonth).padStart(2, '0')}/{String(expiryYear).slice(-2)}
                </Text>
              </View>
            )}
            <View style={styles.mastercard}>
              <View style={[styles.mastercardCircle, styles.mastercardRed]} />
              <View style={[styles.mastercardCircle, styles.mastercardOrange]} />
              <Text style={styles.mastercardText}>MASTERCARD</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  gradient: {
    aspectRatio: 1.586, // Standard card ratio
    padding: spacing.xl,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  patternLine: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  cardType: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  cardNumber: {
    ...typography.title,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  expiryContainer: {
    
  },
  expiryLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  expiry: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
  },
  mastercard: {
    alignItems: 'flex-end',
  },
  mastercardCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
  },
  mastercardRed: {
    backgroundColor: '#EB001B',
    right: 16,
    top: 0,
  },
  mastercardOrange: {
    backgroundColor: '#F79E1B',
    right: 0,
    top: 0,
  },
  mastercardText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginTop: 32,
  },
});
