import { CustomAmmoDto } from './custom-ammo.dto';

export class CustomAmmoLoadout {
  id: number;
  name: string;
  imagePath: string;
  price: number;

  constructor(dto: CustomAmmoDto) {
    this.id = dto.id;
    this.name = dto.name;
    this.imagePath = `data/img/custom-ammo/${this.id}.png`;
    this.price = dto.price;
  }
}
