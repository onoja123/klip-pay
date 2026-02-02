import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { typography, radii, spacing, shadows } from '@/constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

export interface CardData {
  id: string;
  last4: string;
  cvv?: string;
  expiryMonth: number;
  expiryYear: number;
  brand: 'mastercard' | 'visa';
  type: 'debit' | 'virtual';
  color: [string, string, string];
  status: 'active' | 'frozen' | 'pending';
}

interface CardStackProps {
  cards: CardData[];
  onCardPress?: (card: CardData) => void;
}

export function CardStack({ cards, onCardPress }: CardStackProps) {
  const [cardOrder, setCardOrder] = useState(cards.map((_, i) => i));
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 180;
    rotateY.value = withSpring(toValue, { damping: 15, stiffness: 80 });
    setIsFlipped(!isFlipped);
    triggerHaptic();
  };

  const slideToNextCard = () => {
    if (cards.length <= 1) return;
    
    // Reset flip first
    if (isFlipped) {
      rotateY.value = withTiming(0, { duration: 150 });
      setIsFlipped(false);
    }

    // Animate card sliding out to the left
    translateX.value = withTiming(-SCREEN_WIDTH, { 
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }, () => {
      // Reset position instantly
      translateX.value = 0;
      // Update card order
      runOnJS(updateCardOrderNext)();
    });
    
    triggerHaptic();
  };

  const slideToPrevCard = () => {
    if (cards.length <= 1) return;
    
    if (isFlipped) {
      rotateY.value = withTiming(0, { duration: 150 });
      setIsFlipped(false);
    }

    translateX.value = withTiming(SCREEN_WIDTH, { 
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }, () => {
      translateX.value = 0;
      runOnJS(updateCardOrderPrev)();
    });
    
    triggerHaptic();
  };

  const updateCardOrderNext = () => {
    setCardOrder(prev => {
      const newOrder = [...prev];
      const first = newOrder.shift()!;
      newOrder.push(first);
      return newOrder;
    });
  };

  const updateCardOrderPrev = () => {
    setCardOrder(prev => {
      const newOrder = [...prev];
      const last = newOrder.pop()!;
      newOrder.unshift(last);
      return newOrder;
    });
  };

  // Pan gesture for swiping
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Horizontal movement for sliding between cards
      translateX.value = event.translationX * 0.8;
      // Slight vertical for feel
      translateY.value = event.translationY * 0.2;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      
      // Slide to next/prev card
      if (translationX < -SWIPE_THRESHOLD || velocityX < -500) {
        runOnJS(slideToNextCard)();
      } else if (translationX > SWIPE_THRESHOLD || velocityX > 500) {
        runOnJS(slideToPrevCard)();
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  // Tap gesture to flip card
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      runOnJS(flipCard)();
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  // Get current top card
  const topCardIndex = cardOrder[0];
  const topCard = cards[topCardIndex];

  // Front card animation
  const frontCardStyle = useAnimatedStyle(() => {
    const rotateYDeg = interpolate(rotateY.value, [0, 180], [0, 180]);
    return {
      transform: [
        { perspective: 1200 },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateY: `${rotateYDeg}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden' as const,
    };
  });

  // Back card animation
  const backCardStyle = useAnimatedStyle(() => {
    const rotateYDeg = interpolate(rotateY.value, [0, 180], [180, 360]);
    return {
      transform: [
        { perspective: 1200 },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateY: `${rotateYDeg}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden' as const,
    };
  });

  // Background cards style (static stack effect)
  const getBackgroundCardStyle = (position: number) => {
    const offset = position * 6;
    const scaleVal = 1 - position * 0.04;
    return {
      transform: [
        { translateY: -offset },
        { scale: scaleVal },
      ],
      zIndex: cards.length - position,
    };
  };

  return (
    <View style={styles.container}>
      {/* Background cards (stack effect) */}
      {cardOrder.slice(1, 3).map((cardIndex, position) => {
        const card = cards[cardIndex];
        return (
          <Animated.View 
            key={card.id} 
            style={[
              styles.backgroundCard,
              getBackgroundCardStyle(position + 1),
            ]}
          >
            <LinearGradient
              colors={card.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
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
            </LinearGradient>
          </Animated.View>
        );
      })}

      {/* Top card with gestures */}
      <GestureDetector gesture={composedGesture}>
        <View style={styles.topCardContainer}>
          {/* Front of card */}
          <Animated.View style={[styles.card, frontCardStyle]}>
            <LinearGradient
              colors={topCard.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
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

              <View style={styles.content}>
                <View style={styles.topRow}>
                  <Text style={styles.brand}>klip.</Text>
                  <Text style={styles.cardType}>
                    {topCard.type === 'virtual' ? 'VIRTUAL CARD' : 'DEBIT CARD'}
                  </Text>
                </View>

                <View style={styles.middleSection}>
                  <Text style={styles.cardNumber}>
                    •••• •••• •••• {topCard.last4}
                  </Text>
                </View>

                <View style={styles.bottomRow}>
                  <View style={styles.expiryContainer}>
                    <Text style={styles.expiryLabel}>VALID THRU</Text>
                    <Text style={styles.expiry}>
                      {String(topCard.expiryMonth).padStart(2, '0')}/{String(topCard.expiryYear).slice(-2)}
                    </Text>
                  </View>
                  <View style={styles.cardBrand}>
                    {topCard.brand === 'mastercard' ? (
                      <>
                        <View style={[styles.brandCircle, styles.mastercardRed]} />
                        <View style={[styles.brandCircle, styles.mastercardOrange]} />
                      </>
                    ) : (
                      <Text style={styles.visaText}>VISA</Text>
                    )}
                    <Text style={styles.brandText}>
                      {topCard.brand.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              {topCard.status === 'frozen' && (
                <View style={styles.frozenOverlay}>
                  <Text style={styles.frozenText}>FROZEN</Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Back of card */}
          <Animated.View style={[styles.card, styles.cardBack, backCardStyle]}>
            <LinearGradient
              colors={topCard.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <View style={styles.magneticStripe} />

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
                    <Text style={styles.cvvText}>{topCard.cvv || '•••'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.backContent}>
                <Text style={styles.backText}>
                  This card is issued by Klip Financial Services pursuant to a license from {topCard.brand === 'mastercard' ? 'Mastercard' : 'Visa'} International.
                </Text>
                
                <View style={styles.backBottomRow}>
                  <Text style={styles.backSmallText}>1-800-KLIP-PAY</Text>
                  <View style={styles.cardBrand}>
                    {topCard.brand === 'mastercard' ? (
                      <>
                        <View style={[styles.brandCircle, styles.mastercardRed]} />
                        <View style={[styles.brandCircle, styles.mastercardOrange]} />
                      </>
                    ) : (
                      <Text style={styles.visaTextSmall}>VISA</Text>
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Card indicators */}
      {cards.length > 1 && (
        <View style={styles.indicators}>
          {cards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                cardOrder[0] === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}

      {/* Hint text */}
      <Text style={styles.hintText}>
        {cards.length > 1 
          ? 'Swipe to change card • Tap to flip'
          : 'Tap to flip'
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  topCardContainer: {
    position: 'relative',
    zIndex: 10,
  },
  card: {
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
  backgroundCard: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    borderRadius: radii.xl,
    overflow: 'hidden',
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
  cardBrand: {
    alignItems: 'flex-end',
    position: 'relative',
    height: 40,
    justifyContent: 'flex-end',
  },
  brandCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    top: 0,
  },
  mastercardRed: {
    backgroundColor: '#EB001B',
    right: 16,
  },
  mastercardOrange: {
    backgroundColor: '#F79E1B',
    right: 0,
  },
  brandText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  },
  visaText: {
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  visaTextSmall: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frozenText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.lg,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(128,128,128,0.3)',
  },
  indicatorActive: {
    backgroundColor: '#666',
    width: 20,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(128,128,128,0.6)',
    marginTop: spacing.sm,
  },
  // Back of card
  magneticStripe: {
    position: 'absolute',
    top: 28,
    left: 0,
    right: 0,
    height: 42,
    backgroundColor: '#000000',
  },
  signatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 55,
    gap: spacing.md,
  },
  signatureStrip: {
    flex: 1,
    height: 38,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  signatureLines: {
    gap: 5,
  },
  signatureLine: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
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
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
  },
});
