import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  IDropdownConfig } from 'combobox';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'lib-playground';
  dateForm: FormGroup;
  startDate: any;
  Item: any;
  selectedItems: any;
  cities: any;
  dropdownSettings: any;
  showAll = false;
  ShowFilter = true;
  disableBangalore = true;
  myForm: FormGroup;
  limitSelection = false;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {

    this.cities = [
      { item_id: 1, item_text: 'New Delhi' },
      { item_id: 2, item_text: 'Mumbai' },
      { item_id: 3, item_text: 'Bangalore', isDisabled: this.disableBangalore },
      { item_id: 4, item_text: 'Pune' },
      { item_id: 5, item_text: 'Chennai' },
      { item_id: 6, item_text: 'Navsari' },
      { item_id: 7, item_text: 'New Delhi2' },
      { item_id: 8, item_text: 'Mumbai2' },
      { item_id: 9, item_text: 'Bangalore4', isDisabled: this.disableBangalore },
      { item_id: 10, item_text: 'Pune5' },
      { item_id: 11, item_text: 'Chennai6' },
      { item_id: 12, item_text: 'Navsari7' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      defaultOpen: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: this.showAll,
      itemsShowLimit: 3,
      allowSearchFilter: this.cities.length > 8
    };
    this.myForm = this.fb.group({
      cities: [[1, 2]]
    });
  }
  submit() {
    console.log('formvalue', this.dateForm);
  }
  submitForm() {
    console.log(this.myForm.value);
  }
  logForm(formValue) {
    console.log(formValue);
  }
  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    console.log('form model', this.myForm.get('cities').value);
  }
  onItemDeSelect(item: any) {
    console.log('onItem DeSelect', item);
    console.log('form model', this.myForm.get('cities').value);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }
  onDropDownClose() {
    console.log('dropdown closed');
  }
  onDeselect($event) {
    console.log('on deselect', $event);
  }

  toogleShowAll() {
    this.showAll = !this.showAll;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
      enableCheckAll: this.showAll
    });
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
      allowSearchFilter: this.ShowFilter
    });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
        limitSelection: 2
      });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
        limitSelection: -1
      });
    }
  }

  handleDisableBangalore() {
    this.cities[2].isDisabled = this.disableBangalore;
    this.cities = [...this.cities];
  }
  onValueChanged($event) {
    console.log('on value change', $event);
  }

  handleReset() {
    this.myForm.get('city').setValue([]);
  }
}
