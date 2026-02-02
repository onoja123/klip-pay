import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, spacing, radii } from '@/constants/tokens';
import { Button, CryptoIcon } from '@/components/ui';
import { useWalletStore } from '@/store/wallet';

const AnimatedView = Animated.View;

export default function AssetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { assets, transactions } = useWalletStore();

  const asset = assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Asset not found</Text>
      </SafeAreaView>
    );
  }

  const assetTransactions = transactions.filter(
    (t) => t.assetSymbol === asset.symbol
  );

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const isPositive = asset.change24h >= 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{asset.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Asset Header */}
        <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.assetHeader}>
          <CryptoIcon symbol={asset.symbol} size={64} color={asset.color} />
          <Text style={styles.assetBalance}>
            {asset.balance} {asset.symbol}
          </Text>
          <Text style={styles.assetValue}>{formatCurrency(asset.valueUsd)}</Text>
          <View style={styles.changeRow}>
            <Ionicons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={16}
              color={isPositive ? colors.success : colors.error}
            />
            <Text style={[styles.changeText, isPositive ? styles.positive : styles.negative]}>
              {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}% (24h)
            </Text>
          </View>
        </AnimatedView>

        {/* Quick Actions */}
        <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/send')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="arrow-up" size={20} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/receive')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="arrow-down" size={20} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/swap')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="swap-horizontal" size={20} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>
        </AnimatedView>

        {/* Price Chart Placeholder */}
        <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.chartSection}>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="analytics-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.chartPlaceholderText}>Price Chart</Text>
          </View>
        </AnimatedView>

        {/* Stats */}
        <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>$45.2B</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>24h Volume</Text>
              <Text style={styles.statValue}>$2.1B</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Circulating</Text>
              <Text style={styles.statValue}>450M</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>All Time High</Text>
              <Text style={styles.statValue}>$259.96</Text>
            </View>
          </View>
        </AnimatedView>

        {/* Recent Transactions */}
        <AnimatedView entering={FadeInDown.delay(300).duration(400)} style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {assetTransactions.length > 0 ? (
            assetTransactions.slice(0, 5).map((tx) => (
              <View key={tx.id} style={styles.transactionRow}>
                <View style={styles.txIcon}>
                  <Ionicons
                    name={tx.type === 'send' ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={tx.type === 'send' ? colors.error : colors.success}
                  />
                </View>
                <View style={styles.txContent}>
                  <Text style={styles.txTitle}>
                    {tx.type === 'send' ? 'Sent' : 'Received'}
                  </Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.txAmount, tx.type === 'send' ? styles.negative : styles.positive]}>
                  {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.assetSymbol}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          )}
        </AnimatedView>
      </ScrollView>
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
  backButton: {
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
    paddingBottom: 100,
  },
  assetHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  assetBalance: {
    ...typography.headline,
    color: colors.text,
    marginTop: spacing.lg,
  },
  assetValue: {
    ...typography.displayMedium,
    color: colors.text,
    marginTop: spacing.xs,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  changeText: {
    ...typography.bodyMedium,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.error,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['3xl'],
    paddingVertical: spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.captionMedium,
    color: colors.text,
  },
  chartSection: {
    marginVertical: spacing.lg,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chartPlaceholderText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  statsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statItem: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.titleSmall,
    color: colors.text,
  },
  transactionsSection: {
    marginBottom: spacing.xl,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  txTitle: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  txDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  txAmount: {
    ...typography.bodyMedium,
  },
  emptyTransactions: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
