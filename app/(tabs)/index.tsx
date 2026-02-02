import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context';
import { spacing, radii, fonts } from '@/constants/tokens';
import { AssetRow, ChipGroup, Skeleton, SkeletonGroup } from '@/components/ui';
import { PromoCard } from '@/components/features';
import { useWalletStore } from '@/store/wallet';

const AnimatedView = Animated.View;

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { assets, totalBalance, isLoading, refreshData } = useWalletStore();
  const [selectedTab, setSelectedTab] = useState('tokens');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const tabs = [
    { label: 'Tokens', value: 'tokens' },
    { label: 'NFTs', value: 'nfts' },
    { label: 'Defi', value: 'defi' },
  ];

  const quickActions = [
    { icon: 'arrow-down-outline' as const, label: 'Receive', route: '/receive' },
    { icon: 'arrow-up-outline' as const, label: 'Send', route: '/send' },
    { icon: 'swap-horizontal-outline' as const, label: 'Swap', route: '/swap' },
    { icon: 'wallet-outline' as const, label: 'Withdraw', route: '/withdraw' },
  ];

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
          <TouchableOpacity style={styles.addressChip}>
            <LinearGradient
              colors={['#E8D5FF', '#FFD5E5']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.addressText}>Address 1</Text>
            <Ionicons name="chevron-down" size={16} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="search-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="scan-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="settings-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </AnimatedView>

        {/* Tab Selector */}
        <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.tabContainer}>
          <ChipGroup
            chips={tabs}
            selected={selectedTab}
            onSelect={setSelectedTab}
          />
        </AnimatedView>

        {/* Balance Section */}
        <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          {isLoading ? (
            <Skeleton width={200} height={48} borderRadius={radii.md} />
          ) : (
            <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
          )}
          <View style={styles.balanceChange}>
            <Ionicons name="trending-up" size={14} color={colors.success} />
            <Text style={styles.balanceChangeText}>+2.4% today</Text>
          </View>
        </AnimatedView>

        {/* Quick Actions */}
        <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickActionItem}
              onPress={() => router.push(action.route as any)}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon} size={20} color={colors.text} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </AnimatedView>

        {/* Promo Card */}
        <AnimatedView entering={FadeInDown.delay(300).duration(400)} style={styles.promoSection}>
          <PromoCard onPress={() => router.push('/card-onboarding')} />
        </AnimatedView>

        {/* Assets List */}
        <AnimatedView entering={FadeInDown.delay(350).duration(400)} style={styles.assetsSection}>
          {isLoading ? (
            <SkeletonGroup count={4} gap={spacing.sm} />
          ) : (
            assets.map((asset, index) => (
              <AnimatedView
                key={asset.id}
                entering={FadeInUp.delay(400 + index * 50).duration(300)}
              >
                <AssetRow
                  asset={asset}
                  onPress={() => router.push(`/asset/${asset.id}` as any)}
                />
              </AnimatedView>
            ))
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.xs,
    borderRadius: radii.full,
    gap: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  addressText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  balanceSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: fonts.sansBold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  balanceChangeText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.success,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  promoSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  assetsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
