import { AmmoType } from './ammo-type';
import { CustomAmmoLoadout } from './custom-ammo.model';
import { ItemType } from './item-type.model';
import { Loadout } from './loadout.model';
import { WeaponDto } from './weapon.dto';

export class WeaponLoadout extends Loadout {
  slots: number;
  ammoTypes: AmmoType[];
  customAmmo: CustomAmmoLoadout[];
  maxCustomAmmo: number;
  akimbo: boolean;

  constructor(
    dto: WeaponDto,
    customAmmoList: CustomAmmoLoadout[],
    akimbo?: boolean
  ) {
    super(
      dto.name,
      `data/img/weapons/${dto.name.replace(/[\s\W]/g, '_')}${
        akimbo ? '_duals' : ''
      }.png`,
      dto.price * (akimbo ? 2 : 1)
    );

    this.slots = dto.slots + (akimbo ? 1 : 0);
    this.ammoTypes = dto.ammoTypes;
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
