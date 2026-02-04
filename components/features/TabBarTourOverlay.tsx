import React, { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context';
import { fonts, radii, spacing } from '@/constants/tokens';

interface TabBarTourOverlayProps {
  visible: boolean;
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  rect?: LayoutRectangle | null;
  screenWidth: number;
  screenHeight: number;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
}

export function TabBarTourOverlay({
  visible,
  step,
  totalSteps,
  title,
  description,
  rect,
  screenWidth,
  screenHeight,
  onNext,
  onSkip,
  isLast,
}: TabBarTourOverlayProps) {
  const { colors } = useTheme();
  const [tooltipHeight, setTooltipHeight] = useState(0);

  const spotlight = useMemo(() => {
    if (!rect) return null;
    const size = Math.max(rect.width, rect.height) + 18;
    const radius = size / 2;
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    return {
      left: centerX - radius,
      top: centerY - radius,
      size,
      radius,
    };
  }, [rect]);

  const tooltipTop = useMemo(() => {
    if (!spotlight || tooltipHeight === 0) {
      return Math.max(screenHeight * 0.55, screenHeight - 220);
    }
    const above = spotlight.top > screenHeight * 0.6;
    if (above) {
      return Math.max(spotlight.top - tooltipHeight - spacing.lg, spacing.lg);
    }
    return Math.min(
      spotlight.top + spotlight.size + spacing.lg,
      screenHeight - tooltipHeight - spacing.lg
    );
  }, [spotlight, tooltipHeight, screenHeight]);

  const tooltipLeft = spacing.lg;
  const tooltipWidth = screenWidth - spacing.lg * 2;

  const handleTooltipLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height !== tooltipHeight) {
      setTooltipHeight(height);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay} pointerEvents="auto">
        <BlurView
          intensity={25}
          tint={colors.background === '#FFFFFF' ? 'light' : 'dark'}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.backdrop, { backgroundColor: colors.overlay }]} />

        {spotlight ? (
          <View
            pointerEvents="none"
            style={[
              styles.spotlight,
              {
                left: spotlight.left,
                top: spotlight.top,
                width: spotlight.size,
                height: spotlight.size,
                borderRadius: spotlight.radius,
                borderColor: colors.primary,
              },
            ]}
          />
        ) : null}

        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              left: tooltipLeft,
              top: tooltipTop,
              width: tooltipWidth,
            },
          ]}
          onLayout={handleTooltipLayout}
        >
          <View style={styles.tooltipHeader}>
            <Text style={[styles.stepText, { color: colors.textTertiary }]}>
              Step {step + 1} of {totalSteps}
            </Text>
            <TouchableOpacity onPress={onSkip} style={styles.closeButton}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip tour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onNext}
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.nextText, { color: colors.textInverse }]}>
                {isLast ? 'Done' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  spotlight: {
    position: 'absolute',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tooltip: {
    position: 'absolute',
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepText: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.sansBold,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  skipText: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
  },
  nextButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.full,
  },
  nextText: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
  },
});
