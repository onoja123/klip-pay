import type { Asset } from '@/types';

export interface AssetRowProps {
  asset: Asset;
  onPress?: () => void;
  showChange?: boolean;
}
