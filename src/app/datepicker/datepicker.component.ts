import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { log } from 'util';
declare var require;
const datepicker =  require('js-datepicker');
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.less']
})
export class DatepickerComponent implements OnInit, AfterViewInit {
   @ViewChild('datepicker', { static: false }) Input: ElementRef;
   picker: any;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.picker =  datepicker(this.Input.nativeElement, {
      formatter: (input, date, instance) => {
        const value = date.toLocaleDateString();
        input.value = value; // => '1/1/2099'
      },
    }
    );

    this.picker.setMin(new Date());
  }
  show() {
    console.log('cliek')
    this.picker.disabled = !this.picker.disabled;
  }


}
