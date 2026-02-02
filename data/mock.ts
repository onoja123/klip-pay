import { Asset, Subscription, Transaction, DebitCard, DeFiPosition, Contact } from '@/types';
import { colors } from '@/constants/tokens';

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: '1',
    symbol: 'SOL',
    name: 'Solana',
    chain: 'solana',
    balance: 245.5,
    valueUsd: 24550.00,
    change24h: 10.22,
    icon: 'solana',
    color: colors.solana,
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    chain: 'ethereum',
    balance: 5.25,
    valueUsd: 15750.00,
    change24h: 2.09,
    icon: 'ethereum',
    color: colors.ethereum,
  },
  {
    id: '3',
    symbol: 'BTC',
    name: 'Bitcoin',
    chain: 'bitcoin',
    balance: 0.125,
    valueUsd: 5250.00,
    change24h: 10.18,
    icon: 'bitcoin',
    color: colors.bitcoin,
  },
  {
    id: '4',
    symbol: 'USDC',
    name: 'USDC',
    chain: 'ethereum',
    balance: 429.09,
    valueUsd: 429.09,
    change24h: 4.32,
    icon: 'usdc',
    color: colors.usdc,
  },
  {
    id: '5',
    symbol: 'POL',
    name: 'Polygon',
    chain: 'polygon',
    balance: 1500,
    valueUsd: 0,
    change24h: -2.5,
    icon: 'polygon',
    color: colors.polygon,
  },
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Spotify',
    icon: 'spotify',
    amount: 9.99,
    currency: 'USDC',
    nextBillingDate: '2026-02-15',
    frequency: 'monthly',
    category: 'entertainment',
    color: '#1DB954',
    active: true,
  },
  {
    id: '2',
    name: 'Netflix',
    icon: 'netflix',
    amount: 15.99,
    currency: 'USDC',
    nextBillingDate: '2026-02-20',
    frequency: 'monthly',
    category: 'entertainment',
    color: '#E50914',
    active: true,
  },
  {
    id: '3',
    name: 'YouTube Music',
    icon: 'youtube',
    amount: 10.99,
    currency: 'USDC',
    nextBillingDate: '2026-02-18',
    frequency: 'monthly',
    category: 'entertainment',
    color: '#FF0000',
    active: true,
  },
  {
    id: '4',
    name: 'Notion',
    icon: 'notion',
    amount: 8.00,
    currency: 'USDC',
    nextBillingDate: '2026-02-25',
    frequency: 'monthly',
    category: 'productivity',
    color: '#000000',
    active: true,
  },
  {
    id: '5',
    name: 'Figma',
    icon: 'figma',
    amount: 12.00,
    currency: 'USDC',
    nextBillingDate: '2026-03-01',
    frequency: 'monthly',
    category: 'productivity',
    color: '#F24E1E',
    active: false,
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    asset: 'Solana',
    assetSymbol: 'SOL',
    amount: 10.5,
    valueUsd: 1050.00,
    timestamp: '2026-02-02T10:30:00Z',
    status: 'confirmed',
    from: '7nYB...4kPq',
  },
  {
    id: '2',
    type: 'send',
    asset: 'USDC',
    assetSymbol: 'USDC',
    amount: 250.00,
    valueUsd: 250.00,
    timestamp: '2026-02-01T15:45:00Z',
    status: 'confirmed',
    to: '3xKm...9wRt',
    fee: 0.50,
  },
  {
    id: '3',
    type: 'swap',
    asset: 'ETH → USDC',
    assetSymbol: 'ETH',
    amount: 0.5,
    valueUsd: 1500.00,
    timestamp: '2026-01-31T09:20:00Z',
    status: 'confirmed',
    fee: 2.50,
  },
  {
    id: '4',
    type: 'subscription',
    asset: 'Spotify',
    assetSymbol: 'USDC',
    amount: 9.99,
    valueUsd: 9.99,
    timestamp: '2026-01-15T00:00:00Z',
    status: 'confirmed',
    to: 'Spotify Inc.',
  },
  {
    id: '5',
    type: 'card_payment',
    asset: 'Coffee Shop',
    assetSymbol: 'USDC',
    amount: 5.50,
    valueUsd: 5.50,
    timestamp: '2026-01-30T08:15:00Z',
    status: 'confirmed',
    to: 'Blue Bottle Coffee',
  },
  {
    id: '6',
    type: 'receive',
    asset: 'Bitcoin',
    assetSymbol: 'BTC',
    amount: 0.025,
    valueUsd: 1050.00,
    timestamp: '2026-01-28T14:00:00Z',
    status: 'pending',
    from: 'bc1q...x7yz',
  },
];

// Mock Debit Card
export const mockDebitCard: DebitCard = {
  id: '1',
  last4: '4892',
  brand: 'mastercard',
  fundingWallet: 'solana',
  status: 'active',
  expiryMonth: 12,
  expiryYear: 2028,
  spentThisMonth: 342.50,
  limit: 5000,
};

// Mock DeFi Positions
export const mockDeFiPositions: DeFiPosition[] = [
  {
    id: '1',
    protocol: 'Marinade',
    type: 'stake',
    asset: 'SOL',
    amount: 100,
    valueUsd: 10000,
    apy: 7.2,
    rewards: 1.5,
  },
  {
    id: '2',
    protocol: 'Aave',
    type: 'lend',
    asset: 'USDC',
    amount: 5000,
    valueUsd: 5000,
    apy: 4.5,
    rewards: 12.5,
  },
];

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alex Chen',
    address: '7nYB...4kPq',
    chain: 'solana',
    avatar: undefined,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Sarah Kim',
    address: '0x3a...9f2e',
    chain: 'ethereum',
    avatar: undefined,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    address: 'bc1q...x7yz',
    chain: 'bitcoin',
    avatar: undefined,
    isFavorite: false,
  },
];

// Calculate total portfolio value
export const getTotalPortfolioValue = (): number => {
  return mockAssets.reduce((sum, asset) => sum + asset.valueUsd, 0);
};

// Get monthly subscription total
export const getMonthlySubscriptionTotal = (): number => {
  return mockSubscriptions
    .filter(sub => sub.active && sub.frequency === 'monthly')
    .reduce((sum, sub) => sum + sub.amount, 0);
};
