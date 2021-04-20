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
    knifeAndHeal: false,
  };

  private _weapons: WeaponLoadout[] = [];
  private _tools: ToolLoadout[] = [];
  private _consumables: ConsumableLoadout[] = [];
  private _customAmmo: CustomAmmoLoadout[] = [];
  private _randomWeapons: (WeaponLoadout | undefined)[] = [
    undefined,
    undefined,
  ];
  private _randomTools: (ToolLoadout | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  private _randomConsumables: (ConsumableLoadout | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  public randomCustomAmmo: [CustomAmmoLoadout[], CustomAmmoLoadout[]] = [
    [],
    [],
  ];
  public totalPrice: number = 0;

  public get randomWeapons(): WeaponLoadout[] {
    return this._randomWeapons.filter((x) => !!x).map((x) => x!);
  }
  public get randomTools(): ToolLoadout[] {
    return this._randomTools.filter((x) => !!x).map((x) => x!);
  }
  public get randomConsumables(): ConsumableLoadout[] {
    return this._randomConsumables.filter((x) => !!x).map((x) => x!);
  }
  private get maxSlotCount(): number {
    return this.settings.quarterMaster ? 5 : 4;
  }

  constructor(apiService: ApiService, prefetchService: PrefetchService) {
    this._apiService = apiService;
    this._prefetchService = prefetchService;
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
    this.randomWeapons.forEach((x) => (x.locked = false));
    this.randomTools.forEach((x) => (x.locked = false));
    this.randomConsumables.forEach((x) => (x.locked = false));
    this.randomize();
  }

  public randomize() {
    this.totalPrice = 0;
    let randomSlotCount = 0;

    // If quarterMaster is active and the randomSlotcoutn is less than the maxSlotCount -> Try again
    randomSlotCount = this.selectRandomWeapons(randomSlotCount);
    if (this.settings.quarterMaster && randomSlotCount < this.maxSlotCount) {
      this.randomize();
      return;
    }

    this.selectRandomItems();

    this.selectRandomCustomAmmo();

    this.randomTools.forEach((x) => (this.totalPrice += x.price));
    this.randomConsumables.forEach((x) => (this.totalPrice += x.price));
    this.randomWeapons.forEach((x) => (this.totalPrice += x.price));
    this.randomCustomAmmo.forEach((x) =>
      x?.forEach((y) => (this.totalPrice += y?.price ?? 0))
    );
  }

  private selectRandomCustomAmmo() {
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
  }

  private selectRandomItems() {
    this._randomTools = this._randomTools.map((x) =>
      x?.locked ? x : undefined
    );
    this._randomConsumables = this._randomConsumables.map((x) =>
      x?.locked ? x : undefined
    );

    if (this.settings.knifeAndHeal) {
      const randomSlot1 = this.randomFromArray([0, 1, 2, 3]);
      const randomSlot2 = this.randomFromArray([0, 1, 2, 3], [randomSlot1]);

      this._randomTools[randomSlot1] = this.randomFromArray(
        this._tools.filter((x) => x.isKnife),
        this.randomTools
      );
      this._randomTools[randomSlot2] = this.randomFromArray(
        this._tools.filter((x) => x.isHeal),
        this.randomTools
      );
    }

    for (let i = 0; i < 4; i++) {
      this._randomTools[i] ??= this.randomFromArray(
        this._tools.filter(
          (x) => !this.randomTools.some((r) => r.isKnife) || !x.isKnife
        ),
        this.randomTools
      );
      this._randomConsumables[i] ??= this.randomFromArray(
        this._consumables,
        this.randomConsumables
      );
    }
  }

  private selectRandomWeapons(randomSlotCount: number) {
    this._randomWeapons = this._randomWeapons.map((x) =>
      x?.locked ? x : undefined
    );

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

    const sortedWeapons = [firstWeapon, secondWeapon].sort(
      (a, b) => b.slots - a.slots
    );

    this._randomWeapons[0] ??= sortedWeapons[0];
    this._randomWeapons[1] ??= sortedWeapons[1];

    randomSlotCount = this.randomWeapons
      .map((x) => x.slots)
      .reduce((a, b) => a + b);
    return randomSlotCount;
  }

  public get preloadData() {
    return this._prefetchService.preloadData;
  }
}
