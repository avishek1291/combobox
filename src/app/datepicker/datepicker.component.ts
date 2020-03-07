import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormGroup
} from '@angular/forms';
declare var datepicker: any;

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
export class DatepickerComponent
  implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {
  // datepicker: any;
  @ViewChild('datepick', { static: false }) input: ElementRef;
  @Input() placeholder: string;
  @Input() initialDate: Date;
  @Input() form: FormGroup;
  @Input() errorKey: string;
  @Input() controlName: string;
  @Input() isDisable: boolean;
  @Input() validate: boolean;

  @Output() selectedDate = new EventEmitter<any>();

  picker: any;
  dateModel: any;
  isStable: boolean;
  constructor(private elem: ElementRef) { }

  propagateValue = (_: any) => { };

  ngAfterViewInit() {
    //// setTimeout(() => {
    this.initDatePicker();
    //  }, 0);
  }

  ngOnInit() {
    // this.initDatePicker();
    if (this.placeholder) {
      this.dateModel = this.placeholder;
    }
  }

  ngOnChanges() {
    this.initDatePicker();
    if (this.initialDate) {
      this.setInitialdate(this.initialDate);
    }
    this.disablePicker(this.isDisable);
  }

  initDatePicker() {
    if (this.picker !== undefined || !this.input) {
      return;
    }
    const options: any = {
      formatter: (input, date) => {
        this.dateModel = new Date(date).toUTCString();
        this.propagateValue(this.dateModel);
        input.value = date;
        input.value = '';
      },
      onSelect: (instance, date) => {
        this.emitSelectedDate(date);
      },
      dateSelected: this.initialDate,
      position: 'br',
      customDays: ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
      disableYearOverlay: true
    };

    this.picker = datepicker(this.input.nativeElement, options);
    this.disablePicker(this.isDisable);
    this.picker.calendarContainer.style.setProperty('font-size', '0.8rem');
  }

  emitSelectedDate(dateValue): void {
    if (dateValue === undefined) {
      this.dateModel = this.placeholder;
    }

    this.selectedDate.emit(dateValue);
  }

  hasValidationError() {
    if (this.validate === false || !this.form) {
      return false;
    }
    if (
      this.form.controls[this.controlName].touched &&
      this.form.controls[this.controlName].status === 'INVALID'
    ) {
      return true;
    } else if (this.form && this.form.errors) {
      return this.form.errors[this.errorKey];
    }
    return false;
  }

  getErrorMsg() {
    if (this.validate === false) {
      return '';
    }
    if (this.form && this.errorKey && this.form.errors) {
      return this.form.errors[this.errorKey];
    }
    return '';
  }

  disablePicker(value) {
    if (this.picker) {
      const disableValue = !value ? false : true;
      // this.picker.disabled = disableValue;
    }
  }
  setInitialdate(dateValue) {
    // if (Object.prototype.toString.call(dateValue) === '[object Date]') {
    try {
      this.picker.setDate(new Date(dateValue), true);
    } catch (e) {
      console.log('[Not a valid date or empty string: ]', e);
    }
  }

  get dateValue() {
    return this.dateModel;
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      console.log('write value', value);
      this.dateModel = value;
    }

  }
  registerOnChange(fn: any): void {

    console.log('regitser');
    this.propagateValue = fn;
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
}
