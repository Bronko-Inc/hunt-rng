import { Component, Input, OnInit } from '@angular/core';
import { ItemType } from '../models/item-type.model';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent implements OnInit {
  ItemType = ItemType;
  @Input() itemType: ItemType = ItemType.UNKNOWN;
  @Input() imgPath: string = '';
  @Input() price: number = 0;

  constructor() {}

  public get backdropImgPath(): string {
    switch (this.itemType) {
      case ItemType.WEAPON_1:
        return 'assets/img/backdrops/1-slot.png';
      case ItemType.WEAPON_2:
        return 'assets/img/backdrops/2-slot.png';
      case ItemType.WEAPON_3:
        return 'assets/img/backdrops/3-slot.png';
      case ItemType.AMMO:
        return 'assets/img/backdrops/ammo.png';
      case ItemType.ITEM:
        return 'assets/img/backdrops/item.png';
      default:
        return '';
    }
  }

  ngOnInit(): void {}
}
