import { ConsumableDto } from './consumable.dto';

export class ConsumableLoadout {
  name: string;
  imagePath: string;
  price: number;

  constructor(dto: ConsumableDto) {
    this.name = dto.name;
    this.imagePath = `data/img/consumables/${dto.name.replace(
      /[\s\W]/g,
      '_'
    )}.png`;
    this.price = dto.price;
  }
}
