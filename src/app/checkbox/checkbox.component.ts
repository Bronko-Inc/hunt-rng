import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'hunt-ckeck',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() text: string = '';
  @Input() disabled = false;
  @Input() name = '';

  isChecked = false;
  onChange = (_: any) => {};
  onBlur = (_: any) => {};

  onChanged($event: Event) {
    this.isChecked = ($event?.target as HTMLInputElement)?.checked;
    this.onChange(this.isChecked);
  }

  fakeClick() {
    this.isChecked = !this.isChecked;
    this.onChange(this.isChecked);
  }

  writeValue(obj: boolean): void {
    this.isChecked = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onBlur = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
