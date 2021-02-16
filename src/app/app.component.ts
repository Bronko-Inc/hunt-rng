import { Component, OnInit } from '@angular/core';
import { WeaponsDto } from './models/weapon.dto';
import { WeaponLoadout } from './models/weapon.model';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly _apiService: ApiService;
  private _weapons?: WeaponLoadout[];
  public randomWeapons: WeaponLoadout[] = [];

  constructor(apiService: ApiService) {
    this._apiService = apiService;
  }

  private randomFromArray<T>(arr: T[]): T {
    const rndmIndex = Math.floor(Math.random() * arr.length);
    return arr[rndmIndex];
  }

  public randomize() {
    const firstWeapon = this.randomFromArray(this._weapons!);
    const secondWeapon = this.randomFromArray(
      this._weapons!.filter((x) => x.slots + firstWeapon.slots <= 4)
    );

    this.randomWeapons = [firstWeapon, secondWeapon].sort(
      (a, b) => b.slots - a.slots
    );
  }

  async ngOnInit(): Promise<void> {
    this._weapons = await this._apiService
      .get<WeaponsDto[]>('/data/weapons.json')
      .then((weaponDtos) => weaponDtos.map((x) => new WeaponLoadout(x)));
    this.randomize();
  }
}
