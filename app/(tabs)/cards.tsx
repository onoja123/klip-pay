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
import { Button } from '@/components/ui';
import { DebitCard, CardStack, CardCustomizeModal, CardCustomization } from '@/components/features';
import { useWalletStore } from '@/store/wallet';
import { mockCards } from '@/data/mock';

const AnimatedView = Animated.View;

export default function CardsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { debitCard, assets } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const hasCard = debitCard && debitCard.status !== 'pending';
  const hasMultipleCards = mockCards.length > 1;

  const handleAddCard = (customization: CardCustomization) => {
    console.log('New card created:', customization);
    // TODO: Add card to state/backend
  };

  const handleCustomizeCard = (customization: CardCustomization) => {
    console.log('Card customized:', customization);
    // TODO: Update card in state/backend
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
          <Text style={styles.title}>Cards</Text>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowAddCardModal(true)}
          >
            <Ionicons name="add-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </AnimatedView>

        {/* Card Preview - Use CardStack if multiple cards, otherwise single DebitCard */}
        <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.cardSection}>
          {hasCard && hasMultipleCards ? (
            <CardStack
              cards={mockCards}
              onCardPress={() => {}}
            />
          ) : (
            <DebitCard
              last4={debitCard?.last4}
              expiryMonth={debitCard?.expiryMonth}
              expiryYear={debitCard?.expiryYear}
              cvv={debitCard?.cvv}
              status={debitCard?.status}
              showDetails={hasCard ?? false}
              onPress={() => !hasCard && router.push('/card-onboarding')}
            />
          )}
        </AnimatedView>

        {hasCard ? (
          <>
            {/* Card Actions */}
            <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="snow-outline" size={20} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>Freeze</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="eye-outline" size={20} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowCustomizeModal(true)}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="color-palette-outline" size={20} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>Customize</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="settings-outline" size={20} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>Settings</Text>
              </TouchableOpacity>
            </AnimatedView>

            {/* Spending Summary */}
            <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.spendingSection}>
              <Text style={styles.sectionTitle}>This Month</Text>
              <View style={styles.spendingCard}>
                <View style={styles.spendingRow}>
                  <Text style={styles.spendingLabel}>Spent</Text>
                  <Text style={styles.spendingValue}>
                    ${debitCard.spentThisMonth.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(debitCard.spentThisMonth / debitCard.limit) * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.spendingRow}>
                  <Text style={styles.limitLabel}>
                    ${debitCard.limit.toLocaleString()} limit
                  </Text>
                  <Text style={styles.limitLabel}>
                    ${(debitCard.limit - debitCard.spentThisMonth).toFixed(2)} left
                  </Text>
                </View>
              </View>
            </AnimatedView>
          </>
        ) : (
          <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Card Yet</Text>
            <Text style={styles.emptyDescription}>
              Get your Klip debit card and start spending your crypto anywhere Mastercard is accepted.
            </Text>
            <Button
              variant="primary"
              onPress={() => router.push('/card-onboarding')}
            >
              Get Your Card
            </Button>
          </AnimatedView>
        )}
      </ScrollView>

      {/* Add Card Modal */}
      <CardCustomizeModal
        visible={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onSave={handleAddCard}
        mode="add"
      />

      {/* Customize Card Modal */}
      <CardCustomizeModal
        visible={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        onSave={handleCustomizeCard}
        mode="customize"
        initialData={{
          name: 'My Card',
          color: ['#2A2A2A', '#1A1A1A', '#0F0F0F'],
        }}
      />
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
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.displayBold,
    color: colors.text,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  spendingSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  spendingCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spendingLabel: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
  },
  spendingValue: {
    fontSize: 28,
    fontFamily: fonts.sansBold,
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radii.full,
    marginVertical: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  limitLabel: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    color: colors.textTertiary,
  },
  emptyState: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['4xl'],
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 28,
    fontFamily: fonts.displayBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyDescription: {
    fontSize: 15,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
