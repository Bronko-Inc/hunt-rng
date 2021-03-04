import { ToolDto } from './tool.dto';

export class ToolLoadout {
  name: string;
  knifeAndHeal: boolean;
  imagePath: string;
  price: number;

  constructor(dto: ToolDto) {
    this.name = dto.name;
    this.knifeAndHeal = dto.knifeAndHeal;
    this.imagePath = `data/img/tools/${dto.name.replace(
      /[\s\W]/g,
      '_'
    )}.png`.toLowerCase();
    this.price = dto.price;
  }
}
