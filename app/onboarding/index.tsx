import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context';
import { spacing, radii, fonts } from '@/constants/tokens';
import { useWalletStore } from '@/store/wallet';

const { width, height } = Dimensions.get('window');

type OnboardingStep = 'welcome' | 'import' | 'currencies' | 'notifications' | 'complete';

const CRYPTO_OPTIONS = [
  { id: 'sol', name: 'Solana', symbol: 'SOL', color: '#9945FF' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', color: '#2775CA' },
  { id: 'matic', name: 'Polygon', symbol: 'POL', color: '#8247E5' },
  { id: 'avax', name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
];

const FIAT_OPTIONS = [
  { id: 'usd', name: 'US Dollar', symbol: 'USD', flag: '🇺🇸' },
  { id: 'eur', name: 'Euro', symbol: 'EUR', flag: '🇪🇺' },
  { id: 'gbp', name: 'British Pound', symbol: 'GBP', flag: '🇬🇧' },
  { id: 'ngn', name: 'Nigerian Naira', symbol: 'NGN', flag: '🇳🇬' },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(['sol', 'eth', 'btc']);
  const [selectedFiat, setSelectedFiat] = useState('usd');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const progress = useSharedValue(0);

  const getStepIndex = (s: OnboardingStep): number => {
    const steps: OnboardingStep[] = ['welcome', 'import', 'currencies', 'notifications', 'complete'];
    return steps.indexOf(s);
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const steps: OnboardingStep[] = ['welcome', 'import', 'currencies', 'notifications', 'complete'];
    const currentIndex = steps.indexOf(step);
    
    if (currentIndex < steps.length - 1) {
      progress.value = withSpring((currentIndex + 1) / (steps.length - 1));
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)');
  };

  const toggleCrypto = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCryptos(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const renderWelcome = () => (
    <Animated.View 
      entering={FadeIn.duration(800)}
      exiting={FadeOut.duration(300)}
      style={styles.stepContainer}
    >
      <View style={styles.welcomeContent}>
        {/* Logo/Brand Mark */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.logoContainer}
        >
          <LinearGradient
            colors={['#1A1A1A', '#2D2D2D']}
            style={styles.logoGradient}
          >
            <Text style={styles.logoText}>K</Text>
          </LinearGradient>
        </Animated.View>

        {/* Brand Name */}
        <Animated.Text 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.brandName}
        >
          Klip
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text 
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.tagline}
        >
          The future of money,{'\n'}
          <Text style={styles.taglineAccent}>beautifully simple.</Text>
        </Animated.Text>

        {/* Features Preview */}
        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.featuresRow}
        >
          {['Crypto', 'Cards', 'DeFi'].map((feature, index) => (
            <View key={feature} style={styles.featureChip}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View 
        entering={FadeInUp.delay(1000).duration(600)}
        style={styles.ctaContainer}
      >
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleNext}>
          <Text style={styles.secondaryButtonText}>I already have a wallet</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  const renderImport = () => (
    <Animated.View 
      entering={SlideInRight.duration(400)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.importContent}
      >
        <Animated.Text 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.stepTitle}
        >
          Import Your{'\n'}
          <Text style={styles.stepTitleAccent}>Wallet</Text>
        </Animated.Text>

        <Animated.Text 
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.stepSubtitle}
        >
          Enter your recovery phrase or connect an existing wallet
        </Animated.Text>

        {/* Import Options */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.importOptions}
        >
          <TouchableOpacity style={styles.importOption}>
            <View style={[styles.importIconBg, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="key-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.importOptionContent}>
              <Text style={styles.importOptionTitle}>Recovery Phrase</Text>
              <Text style={styles.importOptionSubtitle}>12 or 24 word seed phrase</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.importOption}>
            <View style={[styles.importIconBg, { backgroundColor: '#627EEA15' }]}>
              <Ionicons name="wallet-outline" size={24} color="#627EEA" />
            </View>
            <View style={styles.importOptionContent}>
              <Text style={styles.importOptionTitle}>Connect Wallet</Text>
              <Text style={styles.importOptionSubtitle}>MetaMask, Phantom, etc.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.importOption} onPress={handleNext}>
            <View style={[styles.importIconBg, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="add-circle-outline" size={24} color={colors.success} />
            </View>
            <View style={styles.importOptionContent}>
              <Text style={styles.importOptionTitle}>Create New Wallet</Text>
              <Text style={styles.importOptionSubtitle}>Start fresh with a new wallet</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Skip for demo */}
      <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
        <Text style={styles.skipText}>Continue with demo wallet</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCurrencies = () => (
    <Animated.View 
      entering={SlideInRight.duration(400)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.currenciesContent}
      >
        <Animated.Text 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.stepTitle}
        >
          Customize Your{'\n'}
          <Text style={styles.stepTitleAccent}>Experience</Text>
        </Animated.Text>

        {/* Fiat Selection */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionLabel}>HOME CURRENCY</Text>
          <View style={styles.fiatGrid}>
            {FIAT_OPTIONS.map((fiat) => (
              <TouchableOpacity
                key={fiat.id}
                style={[
                  styles.fiatOption,
                  selectedFiat === fiat.id && styles.fiatOptionSelected,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedFiat(fiat.id);
                }}
              >
                <Text style={styles.fiatFlag}>{fiat.flag}</Text>
                <Text style={[
                  styles.fiatSymbol,
                  selectedFiat === fiat.id && styles.fiatSymbolSelected,
                ]}>{fiat.symbol}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Crypto Selection */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={styles.sectionLabel}>FAVORITE TOKENS</Text>
          <Text style={styles.sectionHint}>Select 3-5 to show on your home screen</Text>
          <View style={styles.cryptoGrid}>
            {CRYPTO_OPTIONS.map((crypto, index) => (
              <Animated.View
                key={crypto.id}
                entering={FadeInDown.delay(350 + index * 50).duration(400)}
              >
                <TouchableOpacity
                  style={[
                    styles.cryptoOption,
                    selectedCryptos.includes(crypto.id) && styles.cryptoOptionSelected,
                  ]}
                  onPress={() => toggleCrypto(crypto.id)}
                >
                  <View style={[styles.cryptoIcon, { backgroundColor: crypto.color + '20' }]}>
                    <View style={[styles.cryptoIconInner, { backgroundColor: crypto.color }]} />
                  </View>
                  <Text style={styles.cryptoName}>{crypto.name}</Text>
                  <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                  {selectedCryptos.includes(crypto.id) && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <Animated.View 
        entering={FadeInUp.delay(600).duration(400)}
        style={styles.bottomAction}
      >
        <TouchableOpacity 
          style={[styles.primaryButton, selectedCryptos.length < 3 && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={selectedCryptos.length < 3}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  const renderNotifications = () => (
    <Animated.View 
      entering={SlideInRight.duration(400)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <View style={styles.notificationsContent}>
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.notificationIllustration}
        >
          <View style={styles.bellContainer}>
            <Ionicons name="notifications" size={64} color={colors.primary} />
          </View>
        </Animated.View>

        <Animated.Text 
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.stepTitle}
        >
          Stay in the{'\n'}
          <Text style={styles.stepTitleAccent}>Loop</Text>
        </Animated.Text>

        <Animated.Text 
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.stepSubtitle}
        >
          Get notified about price movements, transactions, and important updates
        </Animated.Text>

        {/* Notification Benefits */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.benefitsList}
        >
          {[
            { icon: 'trending-up', text: 'Price alerts for your tokens' },
            { icon: 'swap-horizontal', text: 'Transaction confirmations' },
            { icon: 'shield-checkmark', text: 'Security notifications' },
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Ionicons name={benefit.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={styles.benefitText}>{benefit.text}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <Animated.View 
        entering={FadeInUp.delay(600).duration(400)}
        style={styles.ctaContainer}
      >
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => {
            setNotificationsEnabled(true);
            handleNext();
          }}
        >
          <Text style={styles.primaryButtonText}>Enable Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleNext}>
          <Text style={styles.secondaryButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  const renderComplete = () => (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={styles.stepContainer}
    >
      <View style={styles.completeContent}>
        {/* Success Animation */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.successCircle}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.successGradient}
          >
            <Ionicons name="checkmark" size={48} color="white" />
          </LinearGradient>
        </Animated.View>

        <Animated.Text 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.completeTitle}
        >
          You're All Set
        </Animated.Text>

        <Animated.Text 
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.completeSubtitle}
        >
          Your wallet is ready. Start exploring the world of crypto with Klip.
        </Animated.Text>

        {/* Summary */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.summaryCard}
        >
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Home Currency</Text>
            <Text style={styles.summaryValue}>
              {FIAT_OPTIONS.find(f => f.id === selectedFiat)?.symbol}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Favorite Tokens</Text>
            <Text style={styles.summaryValue}>{selectedCryptos.length} selected</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Notifications</Text>
            <Text style={styles.summaryValue}>{notificationsEnabled ? 'On' : 'Off'}</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View 
        entering={FadeInUp.delay(800).duration(600)}
        style={styles.bottomAction}
      >
        <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
          <Text style={styles.primaryButtonText}>Enter Klip</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Progress Bar */}
      {step !== 'welcome' && (
        <Animated.View entering={FadeIn} style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
        </Animated.View>
      )}

      {/* Back Button */}
      {step !== 'welcome' && step !== 'complete' && (
        <Animated.View entering={FadeIn} style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              const steps: OnboardingStep[] = ['welcome', 'import', 'currencies', 'notifications', 'complete'];
              const currentIndex = steps.indexOf(step);
              if (currentIndex > 0) {
                progress.value = withSpring((currentIndex - 1) / (steps.length - 1));
                setStep(steps[currentIndex - 1]);
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Content */}
      {step === 'welcome' && renderWelcome()}
      {step === 'import' && renderImport()}
      {step === 'currencies' && renderCurrencies()}
      {step === 'notifications' && renderNotifications()}
      {step === 'complete' && renderComplete()}
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  // Welcome Screen
  welcomeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing['2xl'],
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 48,
    fontFamily: fonts.displayBold,
    color: 'white',
  },
  brandName: {
    fontSize: 56,
    fontFamily: fonts.displayBold,
    color: colors.text,
    letterSpacing: -2,
    marginBottom: spacing.lg,
  },
  tagline: {
    fontSize: 24,
    fontFamily: fonts.serifRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 34,
  },
  taglineAccent: {
    fontFamily: fonts.serifItalic,
    color: colors.primary,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing['3xl'],
  },
  featureChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.full,
  },
  featureText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  ctaContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
    gap: spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    borderRadius: radii.xl,
  },
  primaryButtonText: {
    fontSize: 17,
    fontFamily: fonts.sansSemiBold,
    color: '#FFFFFF',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: fonts.sansMedium,
    color: colors.textSecondary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Import Screen
  importContent: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
  },
  stepTitle: {
    fontSize: 36,
    fontFamily: fonts.displayBold,
    color: colors.text,
    letterSpacing: -1,
    marginBottom: spacing.md,
  },
  stepTitleAccent: {
    color: colors.primary,
    fontFamily: fonts.displayBoldItalic,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing['2xl'],
  },
  importOptions: {
    gap: spacing.md,
  },
  importOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radii.xl,
    gap: spacing.md,
  },
  importIconBg: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importOptionContent: {
    flex: 1,
  },
  importOptionTitle: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
    marginBottom: 2,
  },
  importOptionSubtitle: {
    fontSize: 13,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  skipText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.primary,
  },

  // Currencies Screen
  currenciesContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
    paddingBottom: 120,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  sectionHint: {
    fontSize: 13,
    fontFamily: fonts.sansRegular,
    color: colors.textTertiary,
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  fiatGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fiatOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fiatOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  fiatFlag: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  fiatSymbol: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  fiatSymbolSelected: {
    color: colors.primary,
  },
  cryptoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cryptoOption: {
    width: (width - spacing.xl * 2 - spacing.md * 2) / 3,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cryptoOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cryptoIconInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  cryptoName: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: colors.text,
    marginBottom: 2,
  },
  cryptoSymbol: {
    fontSize: 11,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.background,
  },

  // Notifications Screen
  notificationsContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['4xl'],
  },
  notificationIllustration: {
    marginBottom: spacing['2xl'],
  },
  bellContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitsList: {
    width: '100%',
    marginTop: spacing['2xl'],
    gap: spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 15,
    fontFamily: fonts.sansRegular,
    color: colors.text,
  },

  // Complete Screen
  completeContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['4xl'],
  },
  successCircle: {
    marginBottom: spacing['2xl'],
  },
  successGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: {
    fontSize: 32,
    fontFamily: fonts.displayBold,
    color: colors.text,
    letterSpacing: -1,
    marginBottom: spacing.md,
  },
  completeSubtitle: {
    fontSize: 16,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginTop: spacing['3xl'],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
});
