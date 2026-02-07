import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { typography, spacing, radii, fonts } from '@/constants/tokens';
import { Button, Card, Input, CryptoIcon } from '@/components/ui';
import { useWalletStore } from '@/store/wallet';
import { useTheme } from '@/context';

const AnimatedView = Animated.View;

type WithdrawMethod = 'bank' | 'card' | 'paypal';

export default function WithdrawScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { assets } = useWalletStore();
  
  const [step, setStep] = useState<'amount' | 'method' | 'confirm' | 'success'>('amount');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod | null>(null);
  const [selectedAsset, setSelectedAsset] = useState(assets.find(a => a.symbol === 'USDC') || assets[0]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const fee = parseFloat(amount || '0') * 0.01; // 1% fee
  const total = parseFloat(amount || '0') - fee;

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === 'amount') {
      setStep('method');
    } else if (step === 'method') {
      setStep('confirm');
    } else if (step === 'confirm') {
      setStep('success');
    } else {
      router.back();
    }
  };

  const withdrawMethods = [
    {
      id: 'bank' as const,
      name: 'Bank Account',
      description: 'Wells Fargo ****4521',
      icon: 'business-outline' as const,
      fee: '1%',
      time: '1-3 days',
    },
    {
      id: 'card' as const,
      name: 'Debit Card',
      description: 'Visa ****8832',
      icon: 'card-outline' as const,
      fee: '1.5%',
      time: 'Instant',
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      description: 'john@email.com',
      icon: 'logo-paypal' as const,
      fee: '2%',
      time: 'Instant',
    },
  ];

  const renderAmountStep = () => (
    <AnimatedView entering={FadeInDown.delay(100).duration(400)}>
      <Text style={styles.stepTitle}>Withdraw to Cash</Text>
      <Text style={styles.stepSubtitle}>Convert your crypto to fiat</Text>

      {/* Asset Selector */}
      <Card variant="outlined" style={styles.assetCard}>
        <TouchableOpacity style={styles.assetRow}>
          <CryptoIcon symbol={selectedAsset.symbol} size={40} color={selectedAsset.color} />
          <View style={styles.assetInfo}>
            <Text style={styles.assetName}>{selectedAsset.name}</Text>
            <Text style={styles.assetBalance}>
              Available: {selectedAsset.balance} {selectedAsset.symbol}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Card>

      {/* Amount Input */}
      <View style={styles.amountSection}>
        <View style={styles.amountRow}>
          <Text style={styles.currencySymbol}>$</Text>
          <Input
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={styles.amountInput}
            containerStyle={styles.amountInputContainer}
            inputContainerStyle={styles.amountInputInner}
          />
        </View>
        <TouchableOpacity 
          style={styles.maxButton}
          onPress={() => setAmount(selectedAsset.valueUsd.toFixed(2))}
        >
          <Text style={styles.maxText}>MAX</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Amounts */}
      <View style={styles.quickAmounts}>
        {[50, 100, 250, 500].map((quickAmount) => (
          <TouchableOpacity
            key={quickAmount}
            style={styles.quickAmountButton}
            onPress={() => setAmount(quickAmount.toString())}
          >
            <Text style={styles.quickAmountText}>${quickAmount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        variant="primary"
        size="large"
        onPress={handleContinue}
        disabled={!amount || parseFloat(amount) <= 0}
        style={styles.continueButton}
      >
        Continue
      </Button>
    </AnimatedView>
  );

  const renderMethodStep = () => (
    <AnimatedView entering={FadeInDown.delay(100).duration(400)}>
      <Text style={styles.stepTitle}>Select Destination</Text>
      <Text style={styles.stepSubtitle}>Where should we send your funds?</Text>

      {withdrawMethods.map((method, index) => (
        <AnimatedView
          key={method.id}
          entering={FadeInDown.delay(150 + index * 50).duration(400)}
        >
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardSelected,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.methodIcon}>
              <Ionicons name={method.icon} size={24} color={colors.text} />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </View>
            <View style={styles.methodMeta}>
              <Text style={styles.methodTime}>{method.time}</Text>
              <Text style={styles.methodFee}>Fee: {method.fee}</Text>
            </View>
            {selectedMethod === method.id && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        </AnimatedView>
      ))}

      <TouchableOpacity style={styles.addMethodButton}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.addMethodText}>Add New Method</Text>
      </TouchableOpacity>

      <Button
        variant="primary"
        size="large"
        onPress={handleContinue}
        disabled={!selectedMethod}
        style={styles.continueButton}
      >
        Continue
      </Button>
    </AnimatedView>
  );

  const renderConfirmStep = () => (
    <AnimatedView entering={FadeInDown.delay(100).duration(400)}>
      <Text style={styles.stepTitle}>Confirm Withdrawal</Text>
      <Text style={styles.stepSubtitle}>Review your withdrawal details</Text>

      <Card variant="elevated" style={styles.confirmCard}>
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Amount</Text>
          <Text style={styles.confirmValue}>{formatCurrency(parseFloat(amount))}</Text>
        </View>
        <View style={styles.confirmDivider} />
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>From</Text>
          <Text style={styles.confirmValue}>{selectedAsset.symbol}</Text>
        </View>
        <View style={styles.confirmDivider} />
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>To</Text>
          <Text style={styles.confirmValue}>
            {withdrawMethods.find(m => m.id === selectedMethod)?.name}
          </Text>
        </View>
        <View style={styles.confirmDivider} />
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Fee</Text>
          <Text style={styles.confirmValue}>{formatCurrency(fee)}</Text>
        </View>
        <View style={styles.confirmDivider} />
        <View style={styles.confirmRow}>
          <Text style={styles.totalLabel}>You'll Receive</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
      </Card>

      <Text style={styles.disclaimer}>
        Funds will be available in your {withdrawMethods.find(m => m.id === selectedMethod)?.time.toLowerCase()}.
      </Text>

      <Button
        variant="primary"
        size="large"
        onPress={handleContinue}
        style={styles.continueButton}
      >
        Confirm Withdrawal
      </Button>
    </AnimatedView>
  );

  const renderSuccessStep = () => (
    <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
      </View>
      <Text style={styles.successTitle}>Withdrawal Initiated</Text>
      <Text style={styles.successSubtitle}>
        {formatCurrency(total)} is on its way to your{' '}
        {withdrawMethods.find(m => m.id === selectedMethod)?.name.toLowerCase()}
      </Text>

      <Card variant="outlined" style={styles.successCard}>
        <View style={styles.successRow}>
          <Text style={styles.successLabel}>Transaction ID</Text>
          <Text style={styles.successValue}>WD-{Date.now().toString(36).toUpperCase()}</Text>
        </View>
        <View style={styles.successRow}>
          <Text style={styles.successLabel}>Estimated Arrival</Text>
          <Text style={styles.successValue}>
            {withdrawMethods.find(m => m.id === selectedMethod)?.time}
          </Text>
        </View>
      </Card>

      <Button
        variant="primary"
        size="large"
        onPress={() => router.back()}
        style={styles.continueButton}
      >
        Done
      </Button>
    </AnimatedView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          {step !== 'success' && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: step === 'amount' ? '33%' : step === 'method' ? '66%' : '100%' }]} />
            </View>
          )}
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 'amount' && renderAmountStep()}
          {step === 'method' && renderMethodStep()}
          {step === 'confirm' && renderConfirmStep()}
          {step === 'success' && renderSuccessStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radii.full,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  stepTitle: {
    ...typography.displaySmall,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  assetCard: {
    marginBottom: spacing.lg,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  assetInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  assetName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  assetBalance: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  currencySymbol: {
    fontSize: 36,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0,
    lineHeight: 42,
    color: colors.text,
    marginRight: spacing.sm,
  },
  amountInput: {
    fontSize: 36,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0,
    lineHeight: 42,
    color: colors.text,
    textAlign: 'left',
    minWidth: 160,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 42,
  },
  amountInputContainer: {
    marginBottom: 0,
  },
  amountInputInner: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  maxButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
  },
  maxText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickAmountButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
  },
  quickAmountText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  methodName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  methodDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  methodMeta: {
    alignItems: 'flex-end',
  },
  methodTime: {
    ...typography.captionMedium,
    color: colors.success,
  },
  methodFee: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  addMethodText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  confirmCard: {
    marginBottom: spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  confirmLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  confirmValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  totalLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  totalValue: {
    ...typography.title,
    color: colors.primary,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  continueButton: {
    marginTop: spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.displaySmall,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  successCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  successLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  successValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
});
