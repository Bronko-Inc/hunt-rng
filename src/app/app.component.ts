import { Component, OnInit } from '@angular/core';
import { ConsumableDto } from './models/consumable.dto';
import { ConsumableLoadout } from './models/consumable.model';
import { CustomAmmoDto } from './models/custom-ammo.dto';
import { CustomAmmoLoadout } from './models/custom-ammo.model';
import { ItemType } from './models/item-type.model';
import { ToolDto } from './models/tool.dto';
import { ToolLoadout } from './models/tool.model';
import { WeaponDto } from './models/weapon.dto';
import { WeaponLoadout } from './models/weapon.model';
import { ApiService } from './services/api.service';

export const CUSTOM_AMMO_RATIO = 0.5;
export const CUSTOM_AMMO_MULTIPLE_RATIO = 0.25;
export const AKIMBO_RATIO = 0.5;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public ItemType = ItemType;
  private readonly _apiService: ApiService;
  public includeCustomAmmo: boolean = true;
  public quarterMaster: boolean = false;
  public two = [0, 1];

  private _weapons: WeaponLoadout[] = [];
  private _tools: ToolLoadout[] = [];
  private _consumables: ConsumableLoadout[] = [];
  private _customAmmo: CustomAmmoLoadout[] = [];

  public randomWeapons: WeaponLoadout[] = [];
  public randomTools: ToolLoadout[] = [];
  public randomConsumables: ConsumableLoadout[] = [];
  public randomCustomAmmo: [CustomAmmoLoadout[], CustomAmmoLoadout[]] = [
    [],
    [],
  ];
  public randomAkimbo: boolean[] = [false, false];

  constructor(apiService: ApiService) {
    this._apiService = apiService;
  }

  public get preloadImageLinks(): string[] {
    return [
      ...this._weapons.map((x) => x.imagePath),
      ...this._tools.map((x) => x.imagePath),
      ...this._consumables.map((x) => x.imagePath),
      ...this._customAmmo.map((x) => x.imagePath),
    ];
  }

  private get maxSlotCount(): number {
    return this.quarterMaster ? 5 : 4;
  }

  private randomFromArray<T>(arr: T[], blockList?: T[]): T {
    const filteredArr = arr.filter(
      (x) => !blockList || blockList?.indexOf(x) === -1
    );

    const rndmIndex = Math.floor(Math.random() * filteredArr.length);
    return filteredArr[rndmIndex];
  }

  public randomize() {
    let randomSlotCount = 0;
    this.randomWeapons = [];

    let firstWeapon: WeaponLoadout;
    if (this.quarterMaster) {
      firstWeapon = this.randomFromArray(
        this._weapons.filter((x) => x.slots === 3)
      );
    } else {
      firstWeapon = this.randomFromArray(this._weapons);
    }
    const secondWeapon = this.randomFromArray(
      this._weapons.filter(
        (x) => x.slots + firstWeapon.slots <= this.maxSlotCount
      ),
      [firstWeapon]
    );

    this.randomWeapons = [firstWeapon, secondWeapon].sort(
      (a, b) => b.slots - a.slots
    );

    randomSlotCount = this.randomWeapons
      .map((x) => x.slots)
      .reduce((a, b) => a + b);

    this.randomTools = [];
    this.randomConsumables = [];
    for (let i = 0; i < 4; i++) {
      this.randomTools.push(
        this.randomFromArray(this._tools, this.randomTools)
      );
      this.randomConsumables.push(
        this.randomFromArray(this._consumables, this.randomConsumables)
      );
    }

    this.randomAkimbo = [false, false];

    for (let i = 0; i <= 1; i++) {
      if (Math.random() < AKIMBO_RATIO) {
        if (randomSlotCount < this.maxSlotCount) {
          if (this.randomWeapons[i].akimbo) {
            this.randomAkimbo[i] = true;
            randomSlotCount++;
          }
        }
      }
    }

    if (this.quarterMaster && randomSlotCount < this.maxSlotCount) {
      this.randomize();
      return;
    }

    this.randomCustomAmmo = [[], []];

    if (this.includeCustomAmmo) {
      for (let i = 0; i < this.randomWeapons.length; i++) {
        const weapon = this.randomWeapons[i];
        if (Math.random() < CUSTOM_AMMO_RATIO) {
          let customAmmoAmount = 1;
          if (
            weapon.maxCustomAmmo > customAmmoAmount &&
            Math.random() < CUSTOM_AMMO_MULTIPLE_RATIO
          ) {
            customAmmoAmount = weapon.maxCustomAmmo;
          }
          for (let j = 0; j < customAmmoAmount; j++) {
            this.randomCustomAmmo[i]?.push(
              this.randomFromArray(weapon.customAmmo, [
                ...this.randomCustomAmmo[i],
                ...this._customAmmo.filter((ca) =>
                  this.randomCustomAmmo[i].some((rc) =>
                    rc.blocklist?.includes(ca.id)
                  )
                ),
              ])
            );
          }
        }
      }
    }
  }

  async ngOnInit(): Promise<void> {
    [this._tools, this._consumables, this._customAmmo] = await Promise.all([
      this._apiService
        .get<ToolDto[]>('/data/tools.json')
        .then((dtos) => dtos.map((x) => new ToolLoadout(x))),
      this._apiService
        .get<ConsumableDto[]>('/data/consumables.json')
        .then((dtos) => dtos.map((x) => new ConsumableLoadout(x))),
      this._apiService
        .get<CustomAmmoDto[]>('/data/custom-ammo.json')
        .then((dtos) => dtos.map((x) => new CustomAmmoLoadout(x))),
    ]);

    this._weapons = await this._apiService
      .get<WeaponDto[]>('/data/weapons.json')
      .then((weaponDtos) =>
        weaponDtos.map((x) => new WeaponLoadout(x, this._customAmmo))
      );

    this.randomize();
  }
}
