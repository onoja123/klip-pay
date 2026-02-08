import { create } from 'zustand';
import { Asset, Subscription, Transaction, DebitCard, DeFiPosition, Contact } from '@/types';
import type { WalletState } from '@/types/store/wallet';
import { 
  mockAssets, 
  mockSubscriptions, 
  mockTransactions, 
  mockDebitCard, 
  mockDeFiPositions,
  mockContacts,
  getTotalPortfolioValue 
} from '@/data/mock';

export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial Data
  assets: mockAssets,
  subscriptions: mockSubscriptions,
  transactions: mockTransactions,
  debitCard: mockDebitCard,
  defiPositions: mockDeFiPositions,
  contacts: mockContacts,
  
  // Computed
  totalBalance: getTotalPortfolioValue(),
  
  // UI State
  isLoading: false,
  selectedAsset: null,
  
  // Actions
  setAssets: (assets) => set({ 
    assets, 
    totalBalance: assets.reduce((sum, a) => sum + a.valueUsd, 0) 
  }),
  
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  
  toggleSubscription: (id) => set((state) => ({
    subscriptions: state.subscriptions.map(sub =>
      sub.id === id ? { ...sub, active: !sub.active } : sub
    )
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  refreshData: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    set({ 
      isLoading: false,
      assets: mockAssets,
      totalBalance: getTotalPortfolioValue(),
    });
  },
}));
