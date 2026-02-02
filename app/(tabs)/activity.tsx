import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context';
import { fonts, spacing, radii } from '@/constants/tokens';
import { ChipGroup } from '@/components/ui';
import { TransactionRow } from '@/components/features';
import { useWalletStore } from '@/store/wallet';
import { Transaction } from '@/types';

const AnimatedView = Animated.View;

export default function ActivityScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { transactions } = useWalletStore();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Sent', value: 'send' },
    { label: 'Received', value: 'receive' },
    { label: 'Swaps', value: 'swap' },
  ];

  const filteredTransactions = selectedFilter === 'all'
    ? transactions
    : transactions.filter(t => t.type === selectedFilter);

  const renderTransaction = ({ item, index }: { item: Transaction; index: number }) => (
    <AnimatedView entering={FadeInDown.delay(index * 50).duration(300)}>
      <TransactionRow transaction={item} onPress={() => {}} />
    </AnimatedView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="filter-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </AnimatedView>

      {/* Filters */}
      <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.filtersContainer}>
        <ChipGroup
          chips={filters}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
      </AnimatedView>

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>No Transactions</Text>
          <Text style={styles.emptyDescription}>
            Your transaction history will appear here
          </Text>
        </View>
      )}
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
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingBottom: 100,
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
  },
});
