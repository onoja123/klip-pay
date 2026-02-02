import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { colors, radii } from '@/constants/tokens';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  color?: string;
}

export function CryptoIcon({ symbol, size = 40, color }: CryptoIconProps) {
  const iconSize = size * 0.6;

  const renderIcon = () => {
    switch (symbol.toUpperCase()) {
      case 'SOL':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <G>
              <Path
                d="M4.5 17.5L8 14H20.5L17 17.5H4.5Z"
                fill="white"
              />
              <Path
                d="M4.5 6.5L8 10H20.5L17 6.5H4.5Z"
                fill="white"
              />
              <Path
                d="M4.5 12L8 8.5H20.5L17 12H4.5Z"
                fill="white"
              />
            </G>
          </Svg>
        );
      case 'ETH':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 1L4 12L12 16L20 12L12 1Z"
              fill="white"
              fillOpacity={0.9}
            />
            <Path
              d="M12 16L4 12L12 23L20 12L12 16Z"
              fill="white"
              fillOpacity={0.6}
            />
          </Svg>
        );
      case 'BTC':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
              fill="transparent"
            />
            <Path
              d="M14.5 10.5C15.5 10 16 9 15.5 8C15 7 14 6.5 12.5 6.5V5H11V6.5H10V5H8.5V6.5H7V8H8V16H7V17.5H8.5V19H10V17.5H11V19H12.5V17.5C14.5 17.5 16 16.5 16 14.5C16 13 15.5 11.5 14.5 10.5ZM10 8H12.5C13.5 8 14 8.5 14 9.25C14 10 13.5 10.5 12.5 10.5H10V8ZM13 15.5H10V12.5H13C14 12.5 14.5 13 14.5 14C14.5 15 14 15.5 13 15.5Z"
              fill="white"
            />
          </Svg>
        );
      case 'USDC':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" fill="transparent" />
            <Path
              d="M12 6V7.5M12 16.5V18M9.5 12H14.5M10 9.5C10 8.67 10.9 8 12 8C13.1 8 14 8.67 14 9.5C14 10.33 13.1 11 12 11C10.9 11 10 11.67 10 12.5C10 13.33 10.9 14 12 14C13.1 14 14 14.67 14 14.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Text
              x="12"
              y="16"
              fontSize="8"
              fill="white"
              textAnchor="middle"
            >
              $
            </Text>
          </Svg>
        );
      case 'POL':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M17 7L12 4L7 7V17L12 20L17 17V7Z"
              stroke="white"
              strokeWidth="1.5"
              fill="transparent"
            />
            <Path
              d="M12 4V20M7 7L17 17M17 7L7 17"
              stroke="white"
              strokeWidth="1"
            />
          </Svg>
        );
      default:
        return (
          <Text style={[styles.fallbackText, { fontSize: iconSize * 0.5 }]}>
            {symbol.charAt(0)}
          </Text>
        );
    }
  };

  const getBackgroundColor = () => {
    if (color) return color;
    switch (symbol.toUpperCase()) {
      case 'SOL':
        return colors.solana;
      case 'ETH':
        return colors.ethereum;
      case 'BTC':
        return colors.bitcoin;
      case 'USDC':
        return colors.usdc;
      case 'POL':
        return colors.polygon;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: 'white',
    fontWeight: '700',
  },
});
