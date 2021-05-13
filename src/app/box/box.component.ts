import { Component, Input } from '@angular/core';
import { ItemType } from '../models/item-type.model';
import { PrefetchService } from '../services/prefetch.service';

@Component({
  selector: 'awd-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  ItemType = ItemType;
  private readonly _prefetchService: PrefetchService;

  @Input() itemType: ItemType = ItemType.UNKNOWN;
  @Input() set imgPath(value: string) {
    this.imagePath = value;
    this._prefetchService.prefetch(value);
    if (this._prefetchService.isCached(this.imagePath)) {
      this.imgLoaded = true;
    }
  }

  @Input() price: number = 0;
  @Input() lockCallback: () => void = () => {};
  @Input() locked: boolean = false;
  @Input() itemName: string = '';

  public imagePath: string = '';
  public imgLoaded = false;

  constructor(prefetchService: PrefetchService) {
    this._prefetchService = prefetchService;
  }

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

  public get isAmmoContainer() {
    return this.itemType === ItemType.AMMO;
  }

  public imgDidLoad() {
    this.imgLoaded = true;
  }

  public toggleLock() {
    if (this.isAmmoContainer) {
      return;
    }
    this.lockCallback();
  }
}
