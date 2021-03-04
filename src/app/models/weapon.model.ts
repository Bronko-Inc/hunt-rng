import { AmmoType } from './ammo-type';
import { CustomAmmoLoadout } from './custom-ammo.model';
import { WeaponDto } from './weapon.dto';

export class WeaponLoadout {
  name: string;
  slots: number;
  imagePath: string;
  ammoTypes: AmmoType[];
  price: number;
  customAmmo: CustomAmmoLoadout[];
  maxCustomAmmo: number;

  constructor(dto: WeaponDto, customAmmoList: CustomAmmoLoadout[]) {
    this.name = dto.name;
    this.slots = dto.slots;
    this.imagePath = `data/img/weapons/${dto.name.replace(
      /[\s\W]/g,
      '_'
    )}.png`.toLowerCase();
    this.ammoTypes = dto.ammoTypes;
    this.price = dto.price;
    this.customAmmo = customAmmoList.filter((x) =>
      dto.customAmmo?.includes(x.id)
    );
    this.maxCustomAmmo = dto.maxCustomAmmo ?? 0;
  }
}
