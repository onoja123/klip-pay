// Types for Klip Wallet

export type Chain = 'solana' | 'ethereum' | 'bitcoin' | 'polygon';

export interface User {
  id: string;
  addresses: Record<Chain, string>;
  createdAt: string;
  displayName?: string;
  avatar?: string;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  chain: Chain;
  balance: number;
  valueUsd: number;
  change24h: number;
  icon: string;
  color: string;
}

export interface Wallet {
  chain: Chain;
  address: string;
  assets: Asset[];
  totalValueUsd: number;
}

export interface Subscription {
  id: string;
  name: string;
  icon: string;
  amount: number;
  currency: string;
  nextBillingDate: string;
  frequency: 'monthly' | 'yearly' | 'weekly';
  category: 'entertainment' | 'productivity' | 'finance' | 'other';
  color: string;
  active: boolean;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'subscription' | 'card_payment';
  asset: string;
  assetSymbol: string;
  amount: number;
  valueUsd: number;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  to?: string;
  from?: string;
  fee?: number;
  note?: string;
}

export interface DebitCard {
  id: string;
  last4: string;
  cvv?: string;
  brand: 'mastercard' | 'visa';
  fundingWallet: Chain;
  status: 'active' | 'frozen' | 'pending';
  expiryMonth: number;
  expiryYear: number;
  spentThisMonth: number;
  limit: number;
}

export interface FXRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'stake' | 'lend' | 'liquidity';
  asset: string;
  amount: number;
  valueUsd: number;
  apy: number;
  rewards?: number;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  logo?: string;
  acceptedAssets: string[];
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  chain: Chain;
  avatar?: string;
  isFavorite: boolean;
}

// Component Props Types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type BannerVariant = 'info' | 'success' | 'warning' | 'error';
