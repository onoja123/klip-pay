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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context';
import { fonts, spacing, radii } from '@/constants/tokens';
import { Button, Card, CryptoIcon } from '@/components/ui';
import { useWalletStore } from '@/store/wallet';

const AnimatedView = Animated.View;

export default function DeFiScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { assets, defiPositions } = useWalletStore();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const totalDeFiValue = defiPositions.reduce((sum, pos) => sum + pos.valueUsd, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
          <Text style={styles.title}>DeFi</Text>
        </AnimatedView>

        {/* Quick Actions */}
        <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/swap')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.infoLight }]}>
              <Ionicons name="swap-horizontal" size={24} color={colors.info} />
            </View>
            <Text style={styles.quickActionLabel}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.successLight }]}>
              <Ionicons name="trending-up" size={24} color={colors.success} />
            </View>
            <Text style={styles.quickActionLabel}>Stake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="cash-outline" size={24} color={colors.warning} />
            </View>
            <Text style={styles.quickActionLabel}>Lend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="water-outline" size={24} color={colors.polygon} />
            </View>
            <Text style={styles.quickActionLabel}>Pool</Text>
          </TouchableOpacity>
        </AnimatedView>

        {/* Portfolio Summary */}
        <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.summarySection}>
          <Card variant="filled" padding="xl">
            <Text style={styles.summaryLabel}>Total DeFi Value</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalDeFiValue)}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Staked</Text>
                <Text style={styles.summaryItemValue}>
                  {formatCurrency(defiPositions.filter(p => p.type === 'stake').reduce((s, p) => s + p.valueUsd, 0))}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Lending</Text>
                <Text style={styles.summaryItemValue}>
                  {formatCurrency(defiPositions.filter(p => p.type === 'lend').reduce((s, p) => s + p.valueUsd, 0))}
                </Text>
              </View>
            </View>
          </Card>
        </AnimatedView>

        {/* Positions */}
        <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.positionsSection}>
          <Text style={styles.sectionTitle}>Your Positions</Text>
          {defiPositions.length > 0 ? (
            defiPositions.map((position, index) => (
              <TouchableOpacity key={position.id} style={styles.positionCard}>
                <View style={styles.positionHeader}>
                  <View style={styles.positionInfo}>
                    <CryptoIcon symbol={position.asset} size={40} />
                    <View style={styles.positionDetails}>
                      <Text style={styles.positionProtocol}>{position.protocol}</Text>
                      <Text style={styles.positionType}>
                        {position.type.charAt(0).toUpperCase() + position.type.slice(1)} • {position.asset}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.positionValues}>
                    <Text style={styles.positionValue}>{formatCurrency(position.valueUsd)}</Text>
                    <Text style={styles.positionApy}>{position.apy}% APY</Text>
                  </View>
                </View>
                {position.rewards && position.rewards > 0 && (
                  <View style={styles.rewardsRow}>
                    <Ionicons name="gift-outline" size={16} color={colors.success} />
                    <Text style={styles.rewardsText}>
                      +{position.rewards} {position.asset} rewards earned
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="layers-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No DeFi Positions</Text>
              <Text style={styles.emptyDescription}>
                Start earning yield on your crypto assets
              </Text>
              <Button variant="primary" size="md">
                Explore DeFi
              </Button>
            </View>
          )}
        </AnimatedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.displayBold,
    color: colors.text,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  summarySection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 32,
    fontFamily: fonts.sansBold,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  summaryItemLabel: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryItemValue: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  positionsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  positionCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  positionDetails: {},
  positionProtocol: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  positionType: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  positionValues: {
    alignItems: 'flex-end',
  },
  positionValue: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  positionApy: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    color: colors.success,
    marginTop: 2,
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rewardsText: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    color: colors.success,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  emptyDescription: {
    fontSize: 15,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
