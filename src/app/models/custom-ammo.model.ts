import { CustomAmmoDto } from './custom-ammo.dto';

export class CustomAmmoLoadout {
  id: number;
  name: string;
  imagePath: string;
  price: number;
  blocklist?: number[];

  constructor(dto: CustomAmmoDto) {
    this.id = dto.id;
    this.name = dto.name;
    this.imagePath = `data/img/custom-ammo/${this.id}.png`.toLowerCase();
    this.price = dto.price;
    this.blocklist = dto.blocklist;
  }
}
