import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, spacing, radii } from '@/constants/tokens';
import { Card, Button, Chip, ChipGroup } from '@/components/ui';
import { SubscriptionRow } from '@/components/features';
import { useWalletStore } from '@/store/wallet';

const AnimatedView = Animated.View;

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { subscriptions, toggleSubscription } = useWalletStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === 'all') return true;
    if (filter === 'active') return sub.active;
    if (filter === 'paused') return !sub.active;
    return true;
  });

  const monthlyTotal = subscriptions
    .filter((s) => s.active)
    .reduce((sum, sub) => {
      if (sub.billingCycle === 'yearly') {
        return sum + sub.amount / 12;
      }
      return sum + sub.amount;
    }, 0);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscriptions</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Monthly Summary */}
        <AnimatedView entering={FadeInDown.delay(100).duration(400)}>
          <Card variant="elevated" style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Monthly Total</Text>
            <Text style={styles.summaryValue}>{formatCurrency(monthlyTotal)}</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{subscriptions.filter(s => s.active).length}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{subscriptions.filter(s => !s.active).length}</Text>
                <Text style={styles.statLabel}>Paused</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{subscriptions.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </Card>
        </AnimatedView>

        {/* Filter Chips */}
        <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.filterRow}>
          <ChipGroup
            options={[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Paused', value: 'paused' },
            ]}
            value={filter}
            onChange={(value) => setFilter(value as 'all' | 'active' | 'paused')}
          />
        </AnimatedView>

        {/* Upcoming Bills */}
        <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming This Week</Text>
          <Card variant="outlined" style={styles.upcomingCard}>
            <View style={styles.upcomingRow}>
              <View style={[styles.serviceIcon, { backgroundColor: '#1DB954' }]}>
                <Ionicons name="musical-notes" size={20} color="white" />
              </View>
              <View style={styles.upcomingContent}>
                <Text style={styles.upcomingName}>Spotify Premium</Text>
                <Text style={styles.upcomingDate}>Due in 3 days</Text>
              </View>
              <Text style={styles.upcomingAmount}>$9.99</Text>
            </View>
          </Card>
        </AnimatedView>

        {/* Subscriptions List */}
        <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>All Subscriptions</Text>
          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((subscription, index) => (
              <AnimatedView
                key={subscription.id}
                entering={FadeInDown.delay(300 + index * 50).duration(400)}
              >
                <Card variant="outlined" style={styles.subscriptionCard}>
                  <View style={styles.subscriptionRow}>
                    <View style={[styles.serviceIcon, { backgroundColor: subscription.color }]}>
                      <Ionicons
                        name={getServiceIcon(subscription.merchant.name)}
                        size={20}
                        color="white"
                      />
                    </View>
                    <View style={styles.subscriptionContent}>
                      <Text style={styles.subscriptionName}>{subscription.merchant.name}</Text>
                      <Text style={styles.subscriptionCycle}>
                        {formatCurrency(subscription.amount)} / {subscription.billingCycle}
                      </Text>
                    </View>
                    <Switch
                      value={subscription.active}
                      onValueChange={() => toggleSubscription(subscription.id)}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="white"
                    />
                  </View>
                  <View style={styles.subscriptionFooter}>
                    <Text style={styles.nextBilling}>
                      Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity>
                      <Text style={styles.manageLink}>Manage</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </AnimatedView>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No subscriptions found</Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'active' ? 'No active subscriptions' : 'No paused subscriptions'}
              </Text>
            </View>
          )}
        </AnimatedView>

        {/* Add Subscription CTA */}
        <AnimatedView entering={FadeInDown.delay(400).duration(400)} style={styles.ctaSection}>
          <Card variant="elevated" style={styles.ctaCard}>
            <Ionicons name="add-circle" size={40} color={colors.primary} />
            <Text style={styles.ctaTitle}>Track a New Subscription</Text>
            <Text style={styles.ctaSubtitle}>
              Connect your bank or add manually to track all your recurring payments
            </Text>
            <Button variant="primary" size="medium" onPress={() => {}}>
              Add Subscription
            </Button>
          </Card>
        </AnimatedView>
      </ScrollView>
    </SafeAreaView>
  );
}

function getServiceIcon(serviceName: string): keyof typeof Ionicons.glyphMap {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'Spotify': 'musical-notes',
    'Netflix': 'tv',
    'YouTube Music': 'logo-youtube',
    'Notion': 'document-text',
    'Figma': 'color-palette',
    'Apple Music': 'logo-apple',
    'Amazon Prime': 'logo-amazon',
    'Disney+': 'videocam',
    'HBO Max': 'film',
    'Hulu': 'play-circle',
  };
  return iconMap[serviceName] || 'card';
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
  addButton: {
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
    paddingBottom: 100,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.displayLarge,
    color: colors.text,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.titleSmall,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  filterRow: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  upcomingCard: {
    padding: 0,
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  upcomingName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  upcomingDate: {
    ...typography.caption,
    color: colors.warning,
    marginTop: 2,
  },
  upcomingAmount: {
    ...typography.titleSmall,
    color: colors.text,
  },
  subscriptionCard: {
    marginBottom: spacing.sm,
    padding: 0,
  },
  subscriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  subscriptionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  subscriptionName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  subscriptionCycle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  subscriptionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextBilling: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  manageLink: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyTitle: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  ctaSection: {
    marginTop: spacing.lg,
  },
  ctaCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  ctaTitle: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  ctaSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
