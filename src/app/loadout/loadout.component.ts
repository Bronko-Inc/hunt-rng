import { Component, Input } from '@angular/core';
import { ConsumableLoadout } from '../models/consumable.model';
import { CustomAmmoLoadout } from '../models/custom-ammo.model';
import { ItemType } from '../models/item-type.model';
import { ToolLoadout } from '../models/tool.model';
import { WeaponLoadout } from '../models/weapon.model';

@Component({
  selector: 'awd-loadout',
  templateUrl: './loadout.component.html',
  styleUrls: ['./loadout.component.scss'],
})
export class LoadoutComponent {
  ItemType = ItemType;
  @Input() randomWeapons: WeaponLoadout[] = [];
  @Input() randomCustomAmmo: CustomAmmoLoadout[][] = [];
  @Input() randomTools: ToolLoadout[] = [];
  @Input() randomConsumables: ConsumableLoadout[] = [];

  constructor() {}
}
