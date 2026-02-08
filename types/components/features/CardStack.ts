export interface CardData {
  id: string;
  last4: string;
  cvv?: string;
  expiryMonth: number;
  expiryYear: number;
  brand: 'mastercard' | 'visa';
  type: 'debit' | 'virtual';
  color: [string, string, string];
  status: 'active' | 'frozen' | 'pending';
}

export interface CardStackProps {
  cards: CardData[];
  onCardPress?: (card: CardData) => void;
}
