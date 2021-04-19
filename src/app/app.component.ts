import { Component, OnInit } from '@angular/core';
import { ConsumableDto } from './models/consumable.dto';
import { ConsumableLoadout } from './models/consumable.model';
import { CustomAmmoDto } from './models/custom-ammo.dto';
import { CustomAmmoLoadout } from './models/custom-ammo.model';
import { ItemType } from './models/item-type.model';
import { HuntSettings } from './models/settings-model';
import { ToolDto } from './models/tool.dto';
import { ToolLoadout } from './models/tool.model';
import { WeaponDto } from './models/weapon.dto';
import { WeaponLoadout } from './models/weapon.model';
import { ApiService } from './services/api.service';
import { PrefetchService } from './services/prefetch.service';

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
  private readonly _prefetchService: PrefetchService;

  public showSettings: boolean = false;

  public settings: HuntSettings = {
    quarterMaster: false,
    includeCustomAmmo: true,
  };

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
  public totalPrice: number = 0;

  constructor(apiService: ApiService, prefetchService: PrefetchService) {
    this._apiService = apiService;
    this._prefetchService = prefetchService;
  }

  private get maxSlotCount(): number {
    return this.settings.quarterMaster ? 5 : 4;
  }

  private randomFromArray<T>(arr: T[], blockList?: T[]): T {
    const filteredArr = arr.filter(
      (x) => !blockList || blockList?.indexOf(x) === -1
    );

    const rndmIndex = Math.floor(Math.random() * filteredArr.length);
    return filteredArr[rndmIndex];
  }

  public showSetttings() {
    this.showSettings = true;
  }

  public saveSettings(newSettings: HuntSettings) {
    this.settings = newSettings;
    this.randomize();
  }

  public randomize() {
    this.totalPrice = 0;
    let randomSlotCount = 0;
    this.randomWeapons = [];

    let weaponPool1 = this._weapons;
    let weaponPool2 = this._weapons;
    if (this.settings.quarterMaster) {
      weaponPool1 = weaponPool2 = weaponPool1.filter((x) => x.slots === 3);
    }
    if (!(Math.random() < AKIMBO_RATIO)) {
      weaponPool1 = weaponPool1.filter((x) => !x.akimbo);
    }
    if (!(Math.random() < AKIMBO_RATIO)) {
      weaponPool2 = weaponPool2.filter((x) => !x.akimbo);
    }

    const firstWeapon = this.randomFromArray(weaponPool1);
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

    if (this.settings.quarterMaster && randomSlotCount < this.maxSlotCount) {
      this.randomize();
      return;
    }

    this.randomCustomAmmo = [[], []];

    if (this.settings.includeCustomAmmo) {
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

    this.randomTools.forEach((x) => (this.totalPrice += x.price));
    this.randomConsumables.forEach((x) => (this.totalPrice += x.price));
    this.randomWeapons.forEach((x) => (this.totalPrice += x.price));
    this.randomCustomAmmo.forEach((x) =>
      x.forEach((y) => (this.totalPrice += y.price))
    );
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
        weaponDtos.map((x) => WeaponLoadout.fromDto(x, this._customAmmo)).flat()
      );

    this.randomize();

    this._prefetchService.init([
      ...this._weapons.map((x) => x.imagePath),
      ...this._tools.map((x) => x.imagePath),
      ...this._consumables.map((x) => x.imagePath),
      ...this._customAmmo.map((x) => x.imagePath),
    ]);
  }

  public get preloadData() {
    return this._prefetchService.preloadData;
  }
}
