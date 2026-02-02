import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Rect,
  Line,
  Ellipse,
} from 'react-native-svg';
import { useTheme } from '@/context';

const { width } = Dimensions.get('window');

// Welcome Screen - Person relaxing with phone and floating cards
export const WelcomeIllustration = () => {
  const { colors } = useTheme();
  const strokeColor = colors.text;
  const fillColor = colors.text + '10';

  return (
    <View style={styles.container}>
      <Svg width={width * 0.8} height={180} viewBox="0 0 300 180">
        {/* Couch/Sofa */}
        <Path
          d="M30 120 Q40 105 65 105 L235 105 Q260 105 270 120 L270 140 Q270 155 255 155 L45 155 Q30 155 30 140 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Couch back */}
        <Path
          d="M40 105 Q40 75 55 68 L245 68 Q260 75 260 105"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Couch cushion lines */}
        <Path
          d="M100 105 L100 120 M150 105 L150 120 M200 105 L200 120"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        
        {/* Person sitting */}
        <Circle cx="150" cy="45" r="20" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        {/* Hair */}
        <Path
          d="M132 38 Q137 22 150 18 Q163 22 168 38 Q160 35 150 37 Q140 35 132 38"
          fill={strokeColor}
        />
        {/* Face */}
        <Circle cx="144" cy="43" r="2" fill={strokeColor} />
        <Circle cx="156" cy="43" r="2" fill={strokeColor} />
        <Path d="M146 52 Q150 55 154 52" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Body */}
        <Path d="M150 65 L150 95" stroke={strokeColor} strokeWidth="2" />
        {/* Arms */}
        <Path d="M150 75 L125 88 L112 82" stroke={strokeColor} strokeWidth="2" fill="none" />
        <Path d="M150 75 L175 86 L188 80" stroke={strokeColor} strokeWidth="2" fill="none" />
        {/* Legs */}
        <Path d="M150 95 L130 118 L124 140" stroke={strokeColor} strokeWidth="2" fill="none" />
        <Path d="M150 95 L170 118 L176 140" stroke={strokeColor} strokeWidth="2" fill="none" />

        {/* Phone in hand */}
        <Rect x="182" y="70" width="15" height="22" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        <Line x1="185" y1="76" x2="194" y2="76" stroke={strokeColor} strokeWidth="1" />
        
        {/* Floating card 1 */}
        <G transform="translate(25, 12)">
          <Rect width="45" height="28" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Rect x="5" y="5" width="12" height="7" rx="1" fill={strokeColor} opacity="0.25" />
          <Line x1="5" y1="17" x2="28" y2="17" stroke={strokeColor} strokeWidth="1.5" />
          <Line x1="5" y1="22" x2="18" y2="22" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
        </G>

        {/* Floating card 2 */}
        <G transform="translate(230, 18)">
          <Rect width="40" height="26" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Circle cx="30" cy="9" r="4" fill={strokeColor} opacity="0.2" />
          <Circle cx="26" cy="9" r="4" fill={strokeColor} opacity="0.25" />
          <Line x1="5" y1="19" x2="22" y2="19" stroke={strokeColor} strokeWidth="1" />
        </G>

        {/* Floating coin */}
        <G transform="translate(78, 5)">
          <Circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Path d="M8 4 L8 12 M6 6 L8 4 L10 6" stroke={strokeColor} strokeWidth="1" fill="none" />
        </G>

        {/* Decorative dots */}
        <Circle cx="265" cy="55" r="2" fill={strokeColor} opacity="0.2" />
        <Circle cx="28" cy="65" r="1.5" fill={strokeColor} opacity="0.2" />
      </Svg>
    </View>
  );
};

// Import Wallet - Key, wallet and lock
export const ImportWalletIllustration = () => {
  const { colors } = useTheme();
  const strokeColor = colors.text;
  const fillColor = colors.text + '10';

  return (
    <View style={styles.container}>
      <Svg width={width * 0.8} height={160} viewBox="0 0 300 160">
        {/* Key */}
        <G transform="translate(20, 35)">
          <Circle cx="18" cy="18" r="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <Circle cx="18" cy="18" r="5" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <Rect x="28" y="14" width="35" height="8" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Rect x="55" y="14" width="5" height="14" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <Rect x="62" y="14" width="5" height="10" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
        </G>

        {/* Wallet */}
        <G transform="translate(95, 30)">
          <Path
            d="M0 22 L0 85 Q0 95 10 95 L110 95 Q120 95 120 85 L120 22 Q120 12 110 12 L10 12 Q0 12 0 22"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <Path d="M0 22 Q60 8 120 22" fill="none" stroke={strokeColor} strokeWidth="2" />
          {/* Card slots */}
          <Rect x="10" y="32" width="42" height="26" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Rect x="65" y="32" width="42" height="26" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Line x1="14" y1="40" x2="32" y2="40" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
          <Line x1="69" y1="40" x2="87" y2="40" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
          {/* Money lines */}
          <Line x1="12" y1="68" x2="105" y2="68" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
          <Line x1="22" y1="78" x2="95" y2="78" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 3" opacity="0.2" />
        </G>

        {/* Lock */}
        <G transform="translate(235, 45)">
          <Rect x="0" y="16" width="30" height="24" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <Path d="M6 16 L6 10 Q6 0 15 0 Q24 0 24 10 L24 16" fill="none" stroke={strokeColor} strokeWidth="2" />
          <Circle cx="15" cy="27" r="3" fill={strokeColor} opacity="0.3" />
        </G>

        {/* Floating seed words */}
        <G transform="translate(225, 5)">
          <Rect width="65" height="14" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <Line x1="5" y1="7" x2="38" y2="7" stroke={strokeColor} strokeWidth="1.5" />
        </G>
        <G transform="translate(218, 24)">
          <Rect width="65" height="14" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <Line x1="5" y1="7" x2="45" y2="7" stroke={strokeColor} strokeWidth="1.5" />
        </G>

        {/* Decorative dots */}
        <Circle cx="210" cy="12" r="2" fill={strokeColor} opacity="0.2" />
        <Circle cx="50" cy="115" r="2" fill={strokeColor} opacity="0.15" />
      </Svg>
    </View>
  );
};

// Currencies - Magnifying glass with profile cards
export const CurrenciesIllustration = () => {
  const { colors } = useTheme();
  const strokeColor = colors.text;
  const fillColor = colors.text + '10';

  return (
    <View style={styles.container}>
      <Svg width={width * 0.8} height={160} viewBox="0 0 300 160">
        {/* Profile cards grid */}
        <G transform="translate(100, 15)">
          {/* Card 1 */}
          <Rect width="70" height="55" rx="5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Circle cx="20" cy="20" r="9" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Line x1="36" y1="16" x2="60" y2="16" stroke={strokeColor} strokeWidth="1.5" />
          <Line x1="36" y1="24" x2="52" y2="24" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
          <Circle cx="10" cy="44" r="2" fill={strokeColor} opacity="0.4" />
          <Circle cx="18" cy="44" r="2" fill={strokeColor} opacity="0.4" />
          <Circle cx="26" cy="44" r="2" fill={strokeColor} opacity="0.4" />

          {/* Card 2 */}
          <G transform="translate(80, 0)">
            <Rect width="70" height="55" rx="5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
            <Circle cx="20" cy="20" r="9" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="36" y1="16" x2="60" y2="16" stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="36" y1="24" x2="52" y2="24" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
            <Circle cx="10" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="18" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="26" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="34" cy="44" r="2" fill={strokeColor} opacity="0.4" />
          </G>

          {/* Card 3 */}
          <G transform="translate(0, 62)">
            <Rect width="70" height="55" rx="5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
            <Circle cx="20" cy="20" r="9" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="36" y1="16" x2="60" y2="16" stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="36" y1="24" x2="52" y2="24" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
            <Circle cx="10" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="18" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="26" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="34" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="42" cy="44" r="2" fill={strokeColor} opacity="0.4" />
          </G>

          {/* Card 4 */}
          <G transform="translate(80, 62)">
            <Rect width="70" height="55" rx="5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
            <Circle cx="20" cy="20" r="9" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="36" y1="16" x2="60" y2="16" stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="36" y1="24" x2="52" y2="24" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
            <Circle cx="10" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="18" cy="44" r="2" fill={strokeColor} opacity="0.4" />
            <Circle cx="26" cy="44" r="2" fill={strokeColor} opacity="0.15" />
          </G>
        </G>

        {/* Magnifying glass */}
        <G transform="translate(10, 50)">
          <Circle cx="38" cy="32" r="28" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <Circle cx="38" cy="32" r="20" fill="none" stroke={strokeColor} strokeWidth="1.5" opacity="0.25" />
          {/* Handle */}
          <Path d="M58 50 L80 72 Q83 75 80 78 L77 81 Q74 84 71 81 L49 59" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          
          {/* Face in magnifying glass */}
          <Circle cx="38" cy="30" r="11" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Path d="M29 26 Q32 19 38 17 Q44 19 47 26" fill={strokeColor} />
          <Circle cx="34" cy="28" r="1.5" fill={strokeColor} />
          <Circle cx="42" cy="28" r="1.5" fill={strokeColor} />
          <Path d="M34 35 Q38 38 42 35" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* Decorative dots */}
        <Circle cx="280" cy="30" r="2" fill={strokeColor} opacity="0.2" />
        <Circle cx="18" cy="22" r="1.5" fill={strokeColor} opacity="0.15" />
      </Svg>
    </View>
  );
};

// Notifications - Bell with message bubbles
export const NotificationsIllustration = () => {
  const { colors } = useTheme();
  const strokeColor = colors.text;
  const fillColor = colors.text + '10';

  return (
    <View style={styles.container}>
      <Svg width={width * 0.8} height={160} viewBox="0 0 300 160">
        {/* Main bell - centered */}
        <G transform="translate(100, 10)">
          {/* Bell top */}
          <Circle cx="50" cy="8" r="5" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <Line x1="50" y1="13" x2="50" y2="22" stroke={strokeColor} strokeWidth="2" />
          
          {/* Bell body */}
          <Path
            d="M22 40 Q18 24 50 24 Q82 24 78 40 L82 82 Q82 92 72 92 L28 92 Q18 92 18 82 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <Path d="M24 80 Q50 75 76 80" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.3" />
          
          {/* Clapper */}
          <Ellipse cx="50" cy="96" rx="9" ry="5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Circle cx="50" cy="103" r="4" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </G>

        {/* Notification badge */}
        <Circle cx="180" cy="24" r="9" fill={strokeColor} opacity="0.85" />
        <Circle cx="180" cy="24" r="3" fill={fillColor} />

        {/* Message bubble left */}
        <G transform="translate(15, 40)">
          <Path
            d="M5 0 L50 0 Q55 0 55 5 L55 28 Q55 33 50 33 L16 33 L8 40 L9 33 L5 33 Q0 33 0 28 L0 5 Q0 0 5 0"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <Line x1="7" y1="10" x2="40" y2="10" stroke={strokeColor} strokeWidth="1.5" />
          <Line x1="7" y1="18" x2="32" y2="18" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
        </G>

        {/* Message bubble right */}
        <G transform="translate(220, 65)">
          <Path
            d="M5 0 L55 0 Q60 0 60 5 L60 30 Q60 35 55 35 L45 35 L50 43 L40 35 L5 35 Q0 35 0 30 L0 5 Q0 0 5 0"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <Circle cx="13" cy="17" r="4" fill={strokeColor} opacity="0.25" />
          <Line x1="22" y1="13" x2="48" y2="13" stroke={strokeColor} strokeWidth="1.5" />
          <Line x1="22" y1="22" x2="42" y2="22" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
        </G>

        {/* Sound waves left */}
        <Path d="M88 55 Q78 65 88 75" fill="none" stroke={strokeColor} strokeWidth="1.5" opacity="0.25" />
        <Path d="M75 50 Q60 65 75 80" fill="none" stroke={strokeColor} strokeWidth="1.5" opacity="0.15" />
        
        {/* Sound waves right */}
        <Path d="M212 55 Q222 65 212 75" fill="none" stroke={strokeColor} strokeWidth="1.5" opacity="0.25" />
        <Path d="M225 50 Q240 65 225 80" fill="none" stroke={strokeColor} strokeWidth="1.5" opacity="0.15" />

        {/* Decorative dots */}
        <Circle cx="38" cy="120" r="2" fill={strokeColor} opacity="0.15" />
        <Circle cx="265" cy="115" r="1.5" fill={strokeColor} opacity="0.15" />
      </Svg>
    </View>
  );
};

// Complete - Celebration with trophy and person
export const CompleteIllustration = () => {
  const { colors } = useTheme();
  const strokeColor = colors.text;
  const fillColor = colors.text + '10';

  return (
    <View style={styles.container}>
      <Svg width={width * 0.8} height={180} viewBox="0 0 300 180">
        {/* Confetti elements */}
        <Rect x="45" y="18" width="5" height="5" rx="1" fill={strokeColor} opacity="0.25" transform="rotate(15 47 20)" />
        <Rect x="78" y="32" width="4" height="9" rx="1" fill={strokeColor} opacity="0.2" transform="rotate(-20 80 36)" />
        <Rect x="218" y="22" width="7" height="4" rx="1" fill={strokeColor} opacity="0.25" transform="rotate(30 221 24)" />
        <Rect x="248" y="45" width="4" height="7" rx="1" fill={strokeColor} opacity="0.15" transform="rotate(-15 250 48)" />
        <Circle cx="58" cy="45" r="3" fill={strokeColor} opacity="0.15" />
        <Circle cx="238" cy="35" r="2.5" fill={strokeColor} opacity="0.2" />
        <Circle cx="118" cy="20" r="2" fill={strokeColor} opacity="0.15" />
        <Circle cx="183" cy="28" r="2" fill={strokeColor} opacity="0.2" />

        {/* Trophy */}
        <G transform="translate(115, 25)">
          <Path
            d="M15 8 L55 8 L50 40 Q47 52 35 56 Q23 52 20 40 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <Path d="M15 12 Q2 12 2 24 Q2 36 15 36" fill="none" stroke={strokeColor} strokeWidth="2" />
          <Path d="M55 12 Q68 12 68 24 Q68 36 55 36" fill="none" stroke={strokeColor} strokeWidth="2" />
          <Rect x="28" y="56" width="14" height="7" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Rect x="20" y="63" width="30" height="5" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          {/* Star */}
          <Path
            d="M35 18 L37 25 L44 25 L38 30 L40 37 L35 33 L30 37 L32 30 L26 25 L33 25 Z"
            fill={strokeColor}
            opacity="0.3"
          />
        </G>

        {/* Person celebrating */}
        <G transform="translate(95, 95)">
          {/* Head */}
          <Circle cx="55" cy="14" r="16" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <Path d="M42 10 Q45 2 55 0 Q65 2 68 10 Q61 7 55 9 Q49 7 42 10" fill={strokeColor} />
          <Circle cx="50" cy="12" r="1.5" fill={strokeColor} />
          <Circle cx="60" cy="12" r="1.5" fill={strokeColor} />
          <Path d="M49 20 Q55 25 61 20" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Body */}
          <Path d="M55 30 L55 58" stroke={strokeColor} strokeWidth="2" />
          
          {/* Arms raised */}
          <Path d="M55 38 L32 22 L25 12" stroke={strokeColor} strokeWidth="2" fill="none" />
          <Path d="M55 38 L78 22 L85 12" stroke={strokeColor} strokeWidth="2" fill="none" />
          
          {/* Hands */}
          <Circle cx="25" cy="12" r="4" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <Circle cx="85" cy="12" r="4" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          
          {/* Legs */}
          <Path d="M55 58 L42 80" stroke={strokeColor} strokeWidth="2" />
          <Path d="M55 58 L68 80" stroke={strokeColor} strokeWidth="2" />
        </G>

        {/* Sparkles */}
        <G transform="translate(55, 75)">
          <Line x1="0" y1="7" x2="10" y2="7" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
          <Line x1="5" y1="2" x2="5" y2="12" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
        </G>
        <G transform="translate(230, 78)">
          <Line x1="0" y1="6" x2="9" y2="6" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
          <Line x1="4.5" y1="1" x2="4.5" y2="11" stroke={strokeColor} strokeWidth="1.5" opacity="0.3" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
