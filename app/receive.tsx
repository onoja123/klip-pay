import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { colors, typography, spacing, radii } from '@/constants/tokens';
import { Button, Input, CryptoIcon, ChipGroup } from '@/components/ui';
import { useWalletStore } from '@/store/wallet';

const AnimatedView = Animated.View;

export default function ReceiveScreen() {
  const router = useRouter();
  const { assets } = useWalletStore();
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const walletAddress = '7nYBm...4kPq'; // Simulated address
  const fullAddress = '7nYBmJT8QN2x5k9vLh3rZcW1dF6aPbE4kPq';

  const handleClose = () => {
    router.back();
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(fullAddress);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send ${selectedAsset.symbol} to: ${fullAddress}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Asset Chips */}
        <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.assetsRow}>
          {assets.slice(0, 4).map((asset) => (
            <TouchableOpacity
              key={asset.id}
              style={[
                styles.assetChip,
                selectedAsset.id === asset.id && styles.assetChipSelected,
              ]}
              onPress={() => setSelectedAsset(asset)}
            >
              <CryptoIcon symbol={asset.symbol} size={24} color={asset.color} />
              <Text
                style={[
                  styles.assetChipLabel,
                  selectedAsset.id === asset.id && styles.assetChipLabelSelected,
                ]}
              >
                {asset.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </AnimatedView>

        {/* QR Code Area */}
        <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.qrSection}>
          <View style={styles.qrContainer}>
            {/* Simulated QR Code */}
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={160} color={colors.text} />
            </View>
          </View>
          <Text style={styles.assetLabel}>
            Scan to receive {selectedAsset.name}
          </Text>
        </AnimatedView>

        {/* Address Section */}
        <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.addressSection}>
          <View style={styles.addressBox}>
            <Text style={styles.addressText} numberOfLines={1}>
              {fullAddress}
            </Text>
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity style={styles.addressButton} onPress={handleCopy}>
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={20}
                color={copied ? colors.success : colors.text}
              />
              <Text style={[styles.addressButtonText, copied && { color: colors.success }]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addressButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={colors.text} />
              <Text style={styles.addressButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </AnimatedView>

        {/* Request Amount */}
        <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.requestSection}>
          <Input
            label="Request Specific Amount (Optional)"
            placeholder={`0.00 ${selectedAsset.symbol}`}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </AnimatedView>

        {/* Warning */}
        <AnimatedView entering={FadeInDown.delay(300).duration(400)} style={styles.warningSection}>
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color={colors.warning} />
            <Text style={styles.warningText}>
              Only send {selectedAsset.name} ({selectedAsset.symbol}) to this address. Sending other assets may result in permanent loss.
            </Text>
          </View>
        </AnimatedView>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  assetsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  assetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
  },
  assetChipSelected: {
    backgroundColor: colors.card,
  },
  assetChipLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  assetChipLabelSelected: {
    color: '#FFFFFF',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  qrContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  addressSection: {
    marginBottom: spacing.lg,
  },
  addressBox: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  addressText: {
    ...typography.body,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addressButtonText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  requestSection: {
    marginBottom: spacing.lg,
  },
  warningSection: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  warningText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
    lineHeight: 18,
  },
});

// Need to import Platform
import { Platform } from 'react-native';
