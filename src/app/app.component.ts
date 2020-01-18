import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'lib-playground';
  dateForm: FormGroup;
  startDate: any;
  constructor(private formbuilder: FormBuilder) {}
  ngOnInit() {
    this.dateForm = this.formbuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    this.startDate = '12/09/2018';
  }
  submit() {
    console.log('formvalue', this.dateForm);
  }

  logForm(formValue) {
    console.log(formValue);
  }
}
