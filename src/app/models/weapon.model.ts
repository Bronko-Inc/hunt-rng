import { AmmoType } from './ammo-type';
import { CustomAmmoLoadout } from './custom-ammo.model';
import { ItemType } from './item-type.model';
import { WeaponDto } from './weapon.dto';

export class WeaponLoadout {
  name: string;
  slots: number;
  imagePath: string;
  ammoTypes: AmmoType[];
  price: number;
  customAmmo: CustomAmmoLoadout[];
  maxCustomAmmo: number;
  akimbo: boolean;

  constructor(
    dto: WeaponDto,
    customAmmoList: CustomAmmoLoadout[],
    akimbo?: boolean
  ) {
    this.name = dto.name;
    this.slots = dto.slots + (akimbo ? 1 : 0);
    this.imagePath = `data/img/weapons/${dto.name.replace(/[\s\W]/g, '_')}${
      akimbo ? '_duals' : ''
    }.png`.toLowerCase();
    this.ammoTypes = dto.ammoTypes;
    this.price = dto.price * (akimbo ? 2 : 1);
    this.customAmmo = customAmmoList.filter((x) =>
      dto.customAmmo?.includes(x.id)
    );
    this.maxCustomAmmo = dto.maxCustomAmmo ?? 0;
    this.akimbo = akimbo ?? false;
  }

  public static fromDto(
    dto: WeaponDto,
    customAmmoList: CustomAmmoLoadout[]
  ): WeaponLoadout[] {
    const res = [new WeaponLoadout(dto, customAmmoList)];
    if (dto.akimbo) {
      res.push(new WeaponLoadout(dto, customAmmoList, true));
    }
    return res;
  }

  public get itemType(): ItemType {
    switch (this.slots) {
      case 1:
        return ItemType.WEAPON_1;
      case 2:
        return ItemType.WEAPON_2;
      case 3:
        return ItemType.WEAPON_3;
      default:
        return ItemType.UNKNOWN;
    }
  }
}
