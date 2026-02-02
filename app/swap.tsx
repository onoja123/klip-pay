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
import { colors, typography, spacing, radii } from '@/constants/tokens';
import { Button, CryptoIcon, Input } from '@/components/ui';
import { useWalletStore } from '@/store/wallet';

const AnimatedView = Animated.View;

export default function SwapScreen() {
  const router = useRouter();
  const { assets } = useWalletStore();
  const [fromAsset, setFromAsset] = useState(assets[0]);
  const [toAsset, setToAsset] = useState(assets[3]); // USDC
  const [fromAmount, setFromAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');

  const handleClose = () => {
    router.back();
  };

  const swapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSwap = () => {
    setStep('confirm');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleConfirm = () => {
    setStep('success');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Mock exchange rate
  const exchangeRate = fromAsset.valueUsd / (toAsset.valueUsd || 1);
  const toAmount = parseFloat(fromAmount || '0') * exchangeRate;
  const priceImpact = 0.12;
  const networkFee = 0.50;

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <AnimatedView entering={FadeIn.delay(200).duration(400)} style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </AnimatedView>
          <AnimatedView entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.successTitle}>Swap Complete!</Text>
            <Text style={styles.successDescription}>
              Swapped {fromAmount} {fromAsset.symbol} for {toAmount.toFixed(2)} {toAsset.symbol}
            </Text>
          </AnimatedView>
          <AnimatedView entering={FadeInDown.delay(400).duration(400)} style={styles.successAction}>
            <Button variant="primary" fullWidth onPress={handleClose}>
              Done
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
        <Text style={styles.headerTitle}>
          {step === 'input' ? 'Swap' : 'Confirm Swap'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 'input' ? (
          <>
            {/* From Section */}
            <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.swapCard}>
              <Text style={styles.swapLabel}>From</Text>
              <View style={styles.swapRow}>
                <TouchableOpacity style={styles.assetSelector}>
                  <CryptoIcon symbol={fromAsset.symbol} size={40} color={fromAsset.color} />
                  <Text style={styles.assetSymbol}>{fromAsset.symbol}</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <View style={styles.amountInputContainer}>
                  <Input
                    placeholder="0.00"
                    value={fromAmount}
                    onChangeText={setFromAmount}
                    keyboardType="decimal-pad"
                    containerStyle={styles.amountInput}
                  />
                </View>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceText}>
                  Balance: {fromAsset.balance} {fromAsset.symbol}
                </Text>
                <TouchableOpacity onPress={() => setFromAmount(fromAsset.balance.toString())}>
                  <Text style={styles.maxText}>MAX</Text>
                </TouchableOpacity>
              </View>
            </AnimatedView>

            {/* Swap Button */}
            <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.swapButtonContainer}>
              <TouchableOpacity style={styles.swapButton} onPress={swapAssets}>
                <Ionicons name="swap-vertical" size={24} color={colors.text} />
              </TouchableOpacity>
            </AnimatedView>

            {/* To Section */}
            <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.swapCard}>
              <Text style={styles.swapLabel}>To</Text>
              <View style={styles.swapRow}>
                <TouchableOpacity style={styles.assetSelector}>
                  <CryptoIcon symbol={toAsset.symbol} size={40} color={toAsset.color} />
                  <Text style={styles.assetSymbol}>{toAsset.symbol}</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <View style={styles.amountDisplay}>
                  <Text style={styles.toAmount}>
                    {fromAmount ? toAmount.toFixed(4) : '0.00'}
                  </Text>
                </View>
              </View>
            </AnimatedView>

            {/* Rate Info */}
            {fromAmount && (
              <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.rateInfo}>
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Rate</Text>
                  <Text style={styles.rateValue}>
                    1 {fromAsset.symbol} = {exchangeRate.toFixed(4)} {toAsset.symbol}
                  </Text>
                </View>
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Price Impact</Text>
                  <Text style={styles.rateValue}>{priceImpact}%</Text>
                </View>
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Network Fee</Text>
                  <Text style={styles.rateValue}>~${networkFee.toFixed(2)}</Text>
                </View>
              </AnimatedView>
            )}
          </>
        ) : (
          <>
            {/* Confirmation View */}
            <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.confirmCard}>
              <View style={styles.confirmSwapVisual}>
                <View style={styles.confirmAsset}>
                  <CryptoIcon symbol={fromAsset.symbol} size={48} color={fromAsset.color} />
                  <Text style={styles.confirmAmount}>{fromAmount}</Text>
                  <Text style={styles.confirmSymbol}>{fromAsset.symbol}</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color={colors.textSecondary} />
                <View style={styles.confirmAsset}>
                  <CryptoIcon symbol={toAsset.symbol} size={48} color={toAsset.color} />
                  <Text style={styles.confirmAmount}>{toAmount.toFixed(4)}</Text>
                  <Text style={styles.confirmSymbol}>{toAsset.symbol}</Text>
                </View>
              </View>
            </AnimatedView>

            <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rate</Text>
                <Text style={styles.detailValue}>
                  1 {fromAsset.symbol} = {exchangeRate.toFixed(4)} {toAsset.symbol}
                </Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price Impact</Text>
                <Text style={[styles.detailValue, { color: colors.success }]}>{priceImpact}%</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Network Fee</Text>
                <Text style={styles.detailValue}>~${networkFee.toFixed(2)}</Text>
              </View>
            </AnimatedView>
          </>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        {step === 'input' ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSwap}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          >
            Review Swap
          </Button>
        ) : (
          <View style={styles.confirmActions}>
            <Button
              variant="outline"
              size="lg"
              style={styles.backButton}
              onPress={() => setStep('input')}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              Confirm Swap
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  swapCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  swapLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  assetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
  },
  assetSymbol: {
    ...typography.titleSmall,
    color: colors.text,
  },
  amountInputContainer: {
    flex: 1,
  },
  amountInput: {
    marginBottom: 0,
  },
  amountDisplay: {
    flex: 1,
    alignItems: 'flex-end',
  },
  toAmount: {
    ...typography.headline,
    color: colors.text,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  balanceText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  maxText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: -spacing.md,
    zIndex: 1,
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background,
  },
  rateInfo: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rateLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  rateValue: {
    ...typography.bodySmall,
    color: colors.text,
  },
  bottomAction: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  confirmActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
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
  },
  successAction: {
    width: '100%',
    marginTop: spacing['4xl'],
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  confirmSwapVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmAsset: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  confirmAmount: {
    ...typography.title,
    color: colors.text,
  },
  confirmSymbol: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
