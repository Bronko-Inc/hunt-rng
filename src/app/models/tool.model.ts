import { ToolDto } from './tool.dto';
import { Loadout } from './loadout.model';

export class ToolLoadout extends Loadout {
  public knifeAndHeal: boolean;

  constructor(dto: ToolDto) {
    super(
      dto.name,
      `data/img/tools/${dto.name.replace(/[\s\W]/g, '_')}.png`,
      dto.price
    );
    this.knifeAndHeal = dto.knifeAndHeal;
  }
}
