import type { Transaction } from '@/types';

export interface TransactionRowProps {
  transaction: Transaction;
  onPress?: () => void;
}
