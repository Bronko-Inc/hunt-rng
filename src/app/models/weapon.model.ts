import { AmmoType } from './ammo-type';
import { WeaponDto } from './weapon.dto';

export class WeaponLoadout {
  name: string;
  slots: number;
  imagePath: string;
  ammoTypes: AmmoType[];
  price: number;

  constructor(dto: WeaponDto) {
    this.name = dto.name;
    this.slots = dto.slots;
    this.imagePath = `data/img/weapons/${dto.name.replace(/[\s\W]/g, '_')}.png`;
    this.ammoTypes = dto.ammoTypes;
    this.price = dto.price;
  }
}
