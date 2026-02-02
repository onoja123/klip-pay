import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context';
import { radii, spacing, fonts } from '@/constants/tokens';
import { Asset } from '@/types';
import { CryptoIcon } from './CryptoIcon';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AssetRowProps {
  asset: Asset;
  onPress?: () => void;
  showChange?: boolean;
}

export function AssetRow({ asset, onPress, showChange = true }: AssetRowProps) {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatBalance = (balance: number, symbol: string): string => {
    if (balance >= 1000) {
      return `${balance.toLocaleString()} ${symbol}`;
    }
    return `${balance} ${symbol}`;
  };

  const isPositive = asset.change24h >= 0;

  const styles = createStyles(colors);

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
      style={[styles.container, animatedStyle]}
    >
      <View style={styles.leftSection}>
        <CryptoIcon symbol={asset.symbol} size={44} color={asset.color} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.balance}>
            {formatBalance(asset.balance, asset.symbol)}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.value}>{formatCurrency(asset.valueUsd)}</Text>
        {showChange && (
          <Text style={[styles.change, { color: isPositive ? colors.success : colors.error }]}>
            {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
          </Text>
        )}
      </View>
    </AnimatedTouchable>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  balance: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  change: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    marginTop: 2,
  },
});
