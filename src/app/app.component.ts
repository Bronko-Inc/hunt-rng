import { Component, OnInit } from '@angular/core';
import { ConsumableDto } from './models/consumable.dto';
import { ConsumableLoadout } from './models/consumable.model';
import { ToolDto } from './models/tool.dto';
import { ToolLoadout } from './models/tool.model';
import { WeaponDto } from './models/weapon.dto';
import { WeaponLoadout } from './models/weapon.model';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly _apiService: ApiService;
  private _weapons: WeaponLoadout[] = [];
  private _tools: ToolLoadout[] = [];
  private _consumables: ConsumableLoadout[] = [];
  public randomWeapons: WeaponLoadout[] = [];
  public randomTools: ToolLoadout[] = [];
  public randomConsumables: ConsumableLoadout[] = [];

  constructor(apiService: ApiService) {
    this._apiService = apiService;
  }

  private randomFromArray<T>(arr: T[], blockList?: T[]): T {
    const filteredArr = arr.filter(
      (x) => !blockList || blockList?.indexOf(x) === -1
    );

    const rndmIndex = Math.floor(Math.random() * filteredArr.length);
    return filteredArr[rndmIndex];
  }

  public randomize() {
    const firstWeapon = this.randomFromArray(this._weapons);
    const secondWeapon = this.randomFromArray(
      this._weapons.filter((x) => x.slots + firstWeapon.slots <= 4),
      [firstWeapon]
    );

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

    this.randomWeapons = [firstWeapon, secondWeapon].sort(
      (a, b) => b.slots - a.slots
    );
  }

  async ngOnInit(): Promise<void> {
    [this._weapons, this._tools, this._consumables] = await Promise.all([
      this._apiService
        .get<WeaponDto[]>('/data/weapons.json')
        .then((weaponDtos) => weaponDtos.map((x) => new WeaponLoadout(x))),
      this._apiService
        .get<ToolDto[]>('/data/tools.json')
        .then((weaponDtos) => weaponDtos.map((x) => new ToolLoadout(x))),
      this._apiService
        .get<ConsumableDto[]>('/data/consumables.json')
        .then((weaponDtos) => weaponDtos.map((x) => new ConsumableLoadout(x))),
    ]);
    this.randomize();
  }
}
