export interface DebitCardProps {
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  status?: 'active' | 'frozen' | 'pending';
  onPress?: () => void;
  showDetails?: boolean;
}
