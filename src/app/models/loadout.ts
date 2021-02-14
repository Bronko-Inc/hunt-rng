import { AmmoType } from './ammo-type';

export interface WeaponLoadout {
  name: string;
  slots: number;
  description: string;
  imagePath: string;
  ammoTypes: AmmoType[];
  price: number;
}
