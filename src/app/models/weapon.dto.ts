export interface WeaponDto {
  name: string;
  ammoTypes: number[];
  slots: number;
  price: number;
  customAmmo?: number[];
  maxCustomAmmo?: number;
}
