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
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { typography, spacing, radii } from '@/constants/tokens';
import { Button, Input, CryptoIcon } from '@/components/ui';
import { useWalletStore } from '@/store/wallet';
import { useTheme } from '@/context';

const AnimatedView = Animated.View;

export default function SendScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { assets } = useWalletStore();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');

  const handleClose = () => {
    router.back();
  };

  const handleContinue = () => {
    if (recipient && amount) {
      setStep('confirm');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleConfirm = () => {
    setStep('success');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const estimatedValue = parseFloat(amount || '0') * (selectedAsset.valueUsd / selectedAsset.balance);
  const networkFee = 0.001;

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <AnimatedView entering={FadeIn.delay(200).duration(400)} style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </AnimatedView>
          <AnimatedView entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.successTitle}>Transaction Sent!</Text>
            <Text style={styles.successDescription}>
              {amount} {selectedAsset.symbol} has been sent to {recipient.slice(0, 8)}...
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === 'input' ? 'Send' : 'Confirm'}
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
              {/* Asset Selector */}
              <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
                <Text style={styles.label}>Asset</Text>
                <TouchableOpacity
                  style={styles.assetSelector}
                  onPress={() => setShowAssetPicker(!showAssetPicker)}
                >
                  <CryptoIcon symbol={selectedAsset.symbol} size={40} color={selectedAsset.color} />
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>{selectedAsset.name}</Text>
                    <Text style={styles.assetBalance}>
                      Balance: {selectedAsset.balance} {selectedAsset.symbol}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {showAssetPicker && (
                  <AnimatedView entering={FadeInDown.duration(200)} style={styles.assetList}>
                    {assets.map((asset) => (
                      <TouchableOpacity
                        key={asset.id}
                        style={styles.assetOption}
                        onPress={() => {
                          setSelectedAsset(asset);
                          setShowAssetPicker(false);
                        }}
                      >
                        <CryptoIcon symbol={asset.symbol} size={36} color={asset.color} />
                        <View style={styles.assetInfo}>
                          <Text style={styles.assetName}>{asset.name}</Text>
                          <Text style={styles.assetBalance}>
                            {asset.balance} {asset.symbol}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </AnimatedView>
                )}
              </AnimatedView>

              {/* Recipient Input */}
              <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
                <Input
                  label="Recipient"
                  placeholder="Enter wallet address or ENS name"
                  value={recipient}
                  onChangeText={setRecipient}
                  autoCapitalize="none"
                  autoCorrect={false}
                  suffix={
                    <TouchableOpacity>
                      <Ionicons name="scan" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  }
                />
              </AnimatedView>

              {/* Amount Input */}
              <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
                <Input
                  label="Amount"
                  placeholder="0.00"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  suffix={
                    <TouchableOpacity onPress={() => setAmount(selectedAsset.balance.toString())}>
                      <Text style={styles.maxButton}>MAX</Text>
                    </TouchableOpacity>
                  }
                />
                {amount && (
                  <Text style={styles.estimatedValue}>
                    ≈ {formatCurrency(estimatedValue)}
                  </Text>
                )}
              </AnimatedView>
            </>
          ) : (
            <>
              {/* Confirmation View */}
              <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.confirmCard}>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>To</Text>
                  <Text style={styles.confirmValue}>{recipient.slice(0, 12)}...{recipient.slice(-6)}</Text>
                </View>
                <View style={styles.confirmDivider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Amount</Text>
                  <View style={styles.confirmAmountRow}>
                    <CryptoIcon symbol={selectedAsset.symbol} size={24} color={selectedAsset.color} />
                    <Text style={styles.confirmValue}>{amount} {selectedAsset.symbol}</Text>
                  </View>
                </View>
                <View style={styles.confirmDivider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Network Fee</Text>
                  <Text style={styles.confirmValue}>{networkFee} {selectedAsset.symbol}</Text>
                </View>
                <View style={styles.confirmDivider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Total</Text>
                  <Text style={[styles.confirmValue, styles.totalValue]}>
                    {(parseFloat(amount) + networkFee).toFixed(4)} {selectedAsset.symbol}
                  </Text>
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
              onPress={handleContinue}
              disabled={!recipient || !amount}
            >
              Continue
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
                Confirm & Send
              </Button>
            </View>
          )}
        </View>
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
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  assetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    ...typography.titleSmall,
    color: colors.text,
  },
  assetBalance: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  assetList: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  assetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  maxButton: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  estimatedValue: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginLeft: spacing.lg,
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  confirmLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  confirmValue: {
    ...typography.titleSmall,
    color: colors.text,
  },
  confirmAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  totalValue: {
    ...typography.title,
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
});
