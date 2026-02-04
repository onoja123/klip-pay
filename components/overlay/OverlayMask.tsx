import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, Mask, Rect, Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context';
import { fonts, radii, spacing } from '@/constants/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface OverlayMaskProps {
  visible: boolean;
  stepName: string;
  description?: string;
  rect: LayoutRectangle | null;
  isLast: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export function OverlayMask({
  visible,
  stepName,
  description,
  rect,
  isLast,
  onNext,
  onSkip,
}: OverlayMaskProps) {
  const { colors } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const hasAnimatedIn = useRef(false);

  const cx = useSharedValue(screenWidth / 2);
  const cy = useSharedValue(screenHeight - insets.bottom - 60);
  const r = useSharedValue(40);
  const overlayOpacity = useSharedValue(0);
  const tooltipProgress = useSharedValue(0);

  useEffect(() => {
    if (!visible || !rect) {
      return;
    }
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const radius = Math.max(rect.width, rect.height) / 2 + 12;
    if (!hasAnimatedIn.current) {
      cx.value = screenWidth / 2;
      cy.value = screenHeight / 2;
      r.value = 0;
      cx.value = withTiming(centerX, { duration: 700 });
      cy.value = withTiming(centerY, { duration: 700 });
      r.value = withTiming(radius, { duration: 700 });
      hasAnimatedIn.current = true;
    } else {
      cx.value = withTiming(centerX, { duration: 450 });
      cy.value = withTiming(centerY, { duration: 450 });
      r.value = withTiming(radius, { duration: 450 });
    }

    tooltipProgress.value = 0;
    tooltipProgress.value = withTiming(1, { duration: 360 });
  }, [visible, rect, cx, cy, r, tooltipProgress, screenHeight, screenWidth]);

  useEffect(() => {
    if (!visible) {
      tooltipProgress.value = 0;
      overlayOpacity.value = 0;
      hasAnimatedIn.current = false;
    }
  }, [visible, tooltipProgress]);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = 0;
      overlayOpacity.value = withTiming(1, { duration: 450 });
    }
  }, [overlayOpacity, visible]);

  const animatedCircleProps = useAnimatedProps(() => ({
    cx: cx.value,
    cy: cy.value,
    r: r.value,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipProgress.value,
    transform: [{ translateY: (1 - tooltipProgress.value) * 8 }],
  }));

  const glowProps = useAnimatedProps(() => ({
    cx: cx.value,
    cy: cy.value,
    r: r.value + 6,
  }));

  const glowOuterProps = useAnimatedProps(() => ({
    cx: cx.value,
    cy: cy.value,
    r: r.value + 14,
  }));

  const handleTooltipLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height !== tooltipHeight) {
      setTooltipHeight(height);
    }
  };

  const tooltipTop = useMemo(() => {
    const bottomSafe = insets.bottom + spacing.lg;
    const base = screenHeight - bottomSafe - tooltipHeight;
    if (!rect || tooltipHeight === 0) {
      return Math.max(spacing.lg + insets.top, base);
    }
    const targetY = rect.y - tooltipHeight - spacing.lg;
    return Math.max(spacing.lg + insets.top, Math.min(targetY, base));
  }, [rect, tooltipHeight, screenHeight, insets.bottom, insets.top]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="auto">
      <Svg
        width={screenWidth}
        height={screenHeight}
        style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
      >
        <Defs>
          <Mask id="overlay-mask">
            <Rect width={screenWidth} height={screenHeight} fill="#FFFFFF" />
            <AnimatedCircle animatedProps={animatedCircleProps} fill="#000000" />
          </Mask>
        </Defs>
        <Rect
          width={screenWidth}
          height={screenHeight}
          fill="rgba(0, 0, 0, 0.55)"
          mask="url(#overlay-mask)"
        />
        <AnimatedCircle
          animatedProps={glowOuterProps}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={10}
        />
        <AnimatedCircle
          animatedProps={glowProps}
          fill="rgba(255, 255, 255, 0.12)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth={2}
        />
      </Svg>

      <Animated.View
        style={[
          styles.tooltip,
          {
            top: tooltipTop,
            left: spacing.lg,
            right: spacing.lg,
            zIndex: 2,
          },
          tooltipStyle,
        ]}
        onLayout={handleTooltipLayout}
      >
        <Text style={[styles.title, { color: '#FFFFFF' }]}>{stepName}</Text>
        {description ? (
          <Text style={[styles.description, { color: 'rgba(255, 255, 255, 0.75)' }]}>
            {description}
          </Text>
        ) : null}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={onNext}
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.primaryText, { color: colors.textInverse }]}>
              {isLast ? 'Got it!' : 'Next'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: 'rgba(255, 255, 255, 0.8)' }]}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 20,
  },
  tooltip: {
    position: 'absolute',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.sansSemiBold,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 20,
    fontFamily: fonts.sansRegular,
    lineHeight: 28,
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  primaryButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.full,
  },
  primaryText: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  skipText: {
    fontSize: 16,
    fontFamily: fonts.sansMedium,
  },
});
