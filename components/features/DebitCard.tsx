import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { colors, typography, radii, spacing, shadows } from '@/constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DebitCardProps {
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  status?: 'active' | 'frozen' | 'pending';
  onPress?: () => void;
  showDetails?: boolean;
}

export function DebitCard({
  last4 = '••••',
  expiryMonth,
  expiryYear,
  cvv = '•••',
  status = 'pending',
  onPress,
  showDetails = false,
}: DebitCardProps) {
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const [isFlipped, setIsFlipped] = useState(false);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const flipCard = () => {
    'worklet';
    const toValue = rotateY.value === 0 ? 180 : 0;
    rotateY.value = withSpring(toValue, { damping: 15, stiffness: 80 });
    runOnJS(triggerHaptic)();
    runOnJS(setIsFlipped)(toValue === 180);
  };

  // Swipe gesture to flip
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (Math.abs(event.velocityX) > 300 || Math.abs(event.translationX) > 50) {
        flipCard();
      }
    });

  // Tap gesture to flip (when card has details)
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (showDetails) {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
      }
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      if (showDetails) {
        flipCard();
      } else if (onPress) {
        runOnJS(onPress)();
        runOnJS(triggerHaptic)();
      }
    });

  const composedGesture = showDetails 
    ? Gesture.Race(swipeGesture, tapGesture)
    : tapGesture;

  // Front card animation
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotateY.value, [0, 180], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotate}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  // Back card animation
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotateY.value, [0, 180], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotate}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const CardFront = () => (
    <Animated.View style={[styles.container, frontAnimatedStyle]}>
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

        {/* Swipe hint */}
        {showDetails && !isFlipped && (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>Swipe to see back</Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );

  const CardBack = () => (
    <Animated.View style={[styles.container, styles.cardBack, backAnimatedStyle]}>
      <LinearGradient
        colors={['#2A2A2A', '#1A1A1A', '#0F0F0F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Magnetic stripe */}
        <View style={styles.magneticStripe} />

        {/* Signature strip with CVV */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureStrip}>
            <View style={styles.signatureLines}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={styles.signatureLine} />
              ))}
            </View>
          </View>
          <View style={styles.cvvContainer}>
            <Text style={styles.cvvLabel}>CVV</Text>
            <View style={styles.cvvBox}>
              <Text style={styles.cvvText}>{cvv}</Text>
            </View>
          </View>
        </View>

        {/* Additional info */}
        <View style={styles.backContent}>
          <Text style={styles.backText}>
            This card is issued by Klip Financial Services pursuant to a license from Mastercard International.
          </Text>
          
          <View style={styles.backBottomRow}>
            <Text style={styles.backSmallText}>Customer Service: 1-800-KLIP-PAY</Text>
            <View style={styles.mastercard}>
              <View style={[styles.mastercardCircle, styles.mastercardRed]} />
              <View style={[styles.mastercardCircle, styles.mastercardOrange]} />
            </View>
          </View>
        </View>

        {/* Swipe hint */}
        {showDetails && isFlipped && (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>Swipe to see front</Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.cardWrapper}>
        <CardFront />
        <CardBack />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
  },
  container: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    aspectRatio: 1.586,
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
  expiryContainer: {},
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
  swipeHint: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  // Back of card styles
  magneticStripe: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: '#000000',
  },
  signatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    gap: spacing.md,
  },
  signatureStrip: {
    flex: 1,
    height: 40,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  signatureLines: {
    gap: 6,
  },
  signatureLine: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cvvContainer: {
    alignItems: 'center',
  },
  cvvLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cvvBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 4,
  },
  cvvText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 2,
  },
  backContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backText: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 10,
    marginBottom: spacing.md,
  },
  backBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  backSmallText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
  },
});
