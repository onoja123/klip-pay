import type { Subscription } from '@/types';

export interface SubscriptionRowProps {
  subscription: Subscription;
  onPress?: () => void;
}
