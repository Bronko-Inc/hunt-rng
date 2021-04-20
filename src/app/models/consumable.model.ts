import { ConsumableDto } from './consumable.dto';
import { Loadout } from './loadout.model';

export class ConsumableLoadout extends Loadout {
  constructor(dto: ConsumableDto) {
    super(
      dto.name,
      `data/img/consumables/${dto.name.replace(/[\s\W]/g, '_')}.png`,
      dto.price
    );
  }
}
