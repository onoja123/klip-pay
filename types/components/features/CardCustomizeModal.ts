export interface CardCustomization {
  name: string;
  color: [string, string, string];
  type: 'debit' | 'virtual';
  brand: 'mastercard' | 'visa';
}

export interface CardCustomizeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (customization: CardCustomization) => void;
  mode: 'add' | 'customize';
  initialData?: Partial<CardCustomization>;
}
