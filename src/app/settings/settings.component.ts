import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HuntSettings } from '../models/settings-model';

@Component({
  selector: 'awd-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Input() public set settings(value: HuntSettings | undefined) {
    if (value) {
      this._tmpSettings = { ...value };
    } else {
      this.settings = undefined;
    }
  }
  private _tmpSettings?: HuntSettings;
  @Output() newSettings = new EventEmitter<HuntSettings>();
  @Output() closed = new EventEmitter<void>();

  constructor() {}

  public get settings(): HuntSettings | undefined {
    return this._tmpSettings;
  }

  ngOnInit(): void {
    this._tmpSettings = this.settings;
  }

  save() {
    this.newSettings.next(this.settings);
    this.closed.next();
  }

  discard() {
    this.closed.next();
  }
}
