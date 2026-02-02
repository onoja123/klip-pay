import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { typography, spacing, radii } from '@/constants/tokens';
import { Button, CryptoIcon } from '@/components/ui';
import { DebitCard } from '@/components/features';
import { useWalletStore } from '@/store/wallet';
import { useTheme } from '@/context';

const AnimatedView = Animated.View;

export default function CardOnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { assets } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [step, setStep] = useState<'intro' | 'select' | 'success'>('intro');

  const handleClose = () => {
    router.back();
  };

  const handleGetCard = () => {
    setStep('select');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSelectWallet = (assetId: string) => {
    setSelectedWallet(assetId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleConfirm = () => {
    setStep('success');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <AnimatedView entering={FadeIn.delay(200).duration(400)} style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </AnimatedView>
          <AnimatedView entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.successTitle}>Card Created!</Text>
            <Text style={styles.successDescription}>
              Your Klip debit card is ready. You can start using it immediately with Apple Pay.
            </Text>
          </AnimatedView>
          <AnimatedView entering={FadeInDown.delay(400).duration(400)} style={styles.successAction}>
            <Button variant="primary" fullWidth onPress={handleClose}>
              View My Card
            </Button>
          </AnimatedView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 'intro' ? (
          <>
            {/* Card Preview */}
            <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.cardSection}>
              <DebitCard showDetails={false} />
            </AnimatedView>

            {/* Info Section */}
            <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.infoSection}>
              <Text style={styles.title}>Get Your Debit Card For 2 USD</Text>
              <Text style={styles.subtitle}>
                One-time payment. No subscriptions.{'\n'}No hidden fees.
              </Text>
            </AnimatedView>

            {/* Benefits */}
            <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.benefitsSection}>
              <View style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="globe-outline" size={24} color={colors.text} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Spend Globally</Text>
                  <Text style={styles.benefitDescription}>
                    One card. Real rates. No hidden fees when you spend or withdraw.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="flash-outline" size={24} color={colors.text} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Start Spending Instantly</Text>
                  <Text style={styles.benefitDescription}>
                    As soon as you order, your card is ready to use — including easy setup for Apple Pay.
                  </Text>
                </View>
              </View>
            </AnimatedView>
          </>
        ) : (
          <>
            {/* Card Preview Small */}
            <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.cardSectionSmall}>
              <View style={styles.miniCardWrapper}>
                <DebitCard showDetails={false} />
              </View>
            </AnimatedView>

            {/* Wallet Selection */}
            <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.selectionSection}>
              <View style={styles.selectionHeader}>
                <Text style={styles.selectionTitle}>Choose Funding Wallet</Text>
                <TouchableOpacity onPress={() => setStep('intro')}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={styles.selectionSubtitle}>
                Pick the wallet you want your card to spend from.
              </Text>

              <View style={styles.walletList}>
                {assets.map((asset) => (
                  <TouchableOpacity
                    key={asset.id}
                    style={[
                      styles.walletOption,
                      selectedWallet === asset.id && styles.walletOptionSelected,
                    ]}
                    onPress={() => handleSelectWallet(asset.id)}
                  >
                    <CryptoIcon symbol={asset.symbol} size={44} color={asset.color} />
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletName}>{asset.name}</Text>
                      <Text style={styles.walletBalance}>
                        {asset.balance} {asset.symbol}
                      </Text>
                    </View>
                    {selectedWallet === asset.id && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </AnimatedView>
          </>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        {step === 'intro' ? (
          <Button variant="primary" size="lg" fullWidth onPress={handleGetCard}>
            Get Debit Card
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleConfirm}
            disabled={!selectedWallet}
          >
            Confirm & Pay $2
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cardSection: {
    marginBottom: spacing.xl,
  },
  cardSectionSmall: {
    marginBottom: spacing.lg,
    opacity: 0.7,
  },
  miniCardWrapper: {
    transform: [{ scale: 0.85 }],
    marginHorizontal: -spacing.lg,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headline,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsSection: {
    gap: spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.titleSmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  benefitDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  selectionSection: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectionTitle: {
    ...typography.title,
    color: colors.text,
  },
  selectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  walletList: {
    gap: spacing.sm,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.md,
  },
  walletOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.successLight + '30',
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    ...typography.titleSmall,
    color: colors.text,
  },
  walletBalance: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomAction: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...typography.headline,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  successAction: {
    width: '100%',
    marginTop: spacing['4xl'],
  },
});
