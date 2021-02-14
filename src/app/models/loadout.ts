import { Rarity } from './rarity';

export interface Loadout {
  slots: number;
  name: string;
  description: string;
  imagePath: string;
  rarity: Rarity;
}
