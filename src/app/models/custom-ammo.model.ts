import { CustomAmmoDto } from './custom-ammo.dto';
import { Loadout } from './loadout.model';

export class CustomAmmoLoadout extends Loadout {
  id: number;
  blocklist?: number[];

  constructor(dto: CustomAmmoDto) {
    super(dto.name, `data/img/custom-ammo/${dto.id}.png`, dto.price);
    this.id = dto.id;
    this.blocklist = dto.blocklist;
  }
}
