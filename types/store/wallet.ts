import type { Asset, Subscription, Transaction, DebitCard, DeFiPosition, Contact } from '@/types';

export interface WalletState {
  // Data
  assets: Asset[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  debitCard: DebitCard | null;
  defiPositions: DeFiPosition[];
  contacts: Contact[];

  // Computed
  totalBalance: number;

  // UI State
  isLoading: boolean;
  selectedAsset: Asset | null;

  // Actions
  setAssets: (assets: Asset[]) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  addTransaction: (transaction: Transaction) => void;
  toggleSubscription: (id: string) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => Promise<void>;
}
