import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
declare var require;
const datepicker =  require('js-datepicker');
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @ViewChild('datepicker', { static: false }) Input: ElementRef;

  picker: any;

  @Input() _dateValue: any;

  constructor() { }

  propagateValue =  (_: any) => {};

  ngOnInit() {
    this.dateValue = null;
  }

  ngAfterViewInit() {

    setTimeout( () => {
      this.picker =  datepicker(this.Input.nativeElement, {
        formatter: (input, date, instance) => {
          const value = date.toLocaleDateString();
          input.value = value; // => '1/1/2099'
          this.dateValue = value;
        },
        onSelect: (instance, date) => {
          this.dateValue =  date.toLocaleDateString();
          // this.propagateValue(this.dateValue.toLocaleDateString());
        }
      });
      // .picker.setDate(new Date());
    }, 0);


  }

  set dateValue(val) {
    console.log('set val', val)

    this._dateValue = val;
    this.propagateValue(this._dateValue);
  }


  get dateValue() {
      return this._dateValue;
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      console.log('write value', value)
      this.dateValue = value;
    }

  }
  registerOnChange(fn: any): void {

    console.log('regitser')
    this.propagateValue = fn;
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }

}
