import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  HostListener,
  forwardRef,
  OnChanges
} from '@angular/core';
import { ListFilterPipe } from './combobox-filter.pipe';
import { ListItem } from './combobox.model';
import { IDropdownConfig } from './IDropdownConfig';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'lib-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true
    }
  ]
})
export class ComboboxComponent
  implements OnInit, ControlValueAccessor, OnChanges {
  _settings: IDropdownConfig;

  _data: Array<ListItem> = [];
  selectedItems: Array<ListItem> = [];
  isDropdownOpen = true;

  _placeholder = 'Select';

  _sourceDataType = null; // to keep note of the source data type. could be array of string/number/object

  _sourceDataFields: Array<string> = []; // store source data fields names
  filter: ListItem = new ListItem(this.data);
  defaultSettings: IDropdownConfig = {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
    disabledField: 'isDisabled',
    noOptionField: 'isNoOption',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: false,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 999999999999,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
    allowRemoteDataSearch: false
  };

  @Input()
  public set placeholder(value: string) {
    if (value) {
      this._placeholder = value;
    } else {
      this._placeholder = 'Select';
    }
  }
  @Input()
  disabled = false;

  @Input()
  public set settings(value: IDropdownConfig) {
    if (value) {
      this.backupShowlimitValue = value.itemsShowLimit;
      this._settings = Object.assign(this.defaultSettings, value);
    } else {
      this._settings = Object.assign(this.defaultSettings);
    }
  }

  @Input()
  public set data(value: Array<any>) {
    if (!value) {
      this._data = [];
    } else {
      const firstItem = value[0];
      this._sourceDataType = typeof firstItem;
      this._sourceDataFields = this.getFields(firstItem);
      this._data = value.map((item: any) =>
        typeof item === 'string' || typeof item === 'number'
          ? new ListItem(item)
          : new ListItem({
            id: item[this._settings.idField],
            text: item[this._settings.textField],
            isDisabled: item[this._settings.disabledField],
            isNoOption: item[this._settings.noOptionField]
          })
      );
    }
  }

  @Output()
  FilterChange: EventEmitter<ListItem> = new EventEmitter<any>();
  @Output()
  DropDownClose: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output()
  Select: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output()
  DeSelect: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output()
  SelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<any>>();

  @Output()
  DeSelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<any>>();


  @Output('onChange')
  Change: EventEmitter<Array<ListItem>> = new EventEmitter<Array<any>>();

  toggleShow: boolean;
  backupShowlimitValue: number;
  private onTouchedCallback = () => { };
  private onChangeCallback = (_: any) => { };

  onFilterTextChange($event) {
    this.FilterChange.emit($event);
  }
  ngOnInit() { }
  ngOnChanges() { }
  constructor(
    private cdr: ChangeDetectorRef,
    private listFilterPipe: ListFilterPipe
  ) { }

  onItemClick($event: any, item: ListItem) {
    if (this.disabled || item.isDisabled) {
      return false;
    }

    const found = this.isSelected(item);
    const allowAdd =
      this._settings.limitSelection === -1 ||
      (this._settings.limitSelection > 0 &&
        this.selectedItems.length < this._settings.limitSelection);
    if (!found) {
      if (allowAdd) {
        this.addSelected(item);
      }
    } else {
      this.removeSelected(item);
    }
    if (
      this._settings.singleSelection &&
      this._settings.closeDropDownOnSelection
    ) {
      this.closeDropdown();
    }
  }

  writeValue(value: any) {
    if (value !== undefined && value !== null && value.length > 0) {
      if (this._settings.singleSelection) {
        try {
          if (value.length >= 1) {
            const firstItem = value[0];
            this.selectedItems = [
              typeof firstItem === 'string' || typeof firstItem === 'number'
                ? new ListItem(firstItem)
                : new ListItem({
                  id: firstItem[this._settings.idField],
                  text: firstItem[this._settings.textField],
                  isDisabled: firstItem[this._settings.disabledField],
                  isNoOption: firstItem[this._settings.noOptionField]
                })
            ];
          }
        } catch (e) {
          console.error(e.body.msg);
        }
      } else {

        const _data = this._data
          .map(item => {
            if (value.includes(item.id)) {
              return new ListItem({
                id: item.id,
                text: item.text,
                isDisabled: item.isDisabled,
                isNoOption: item.isNoOption
              });
            }
          })
          .filter(el => !!el);
        if (this._settings.limitSelection > 0) {
          this.selectedItems = _data.splice(0, this._settings.limitSelection);
        } else {
          this.selectedItems = _data;
        }
      }
    } else {
      this.selectedItems = [];
    }
    this.onChangeCallback(value);
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  // Set touched on blur
  @HostListener('blur')
  public onTouched() {
    this.closeDropdown();
    this.onTouchedCallback();
  }

  trackByFn(index, item) {
    return item.id;
  }

  isSelected(clickedItem: ListItem) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  isLimitSelectionReached(): boolean {
    return this._settings.limitSelection === this.selectedItems.length;
  }

  isAllItemsSelected(): boolean {
    // get disabld item count
    const filteredItems = this.listFilterPipe.transform(
      this._data,
      this.filter
    );
    const itemDisabledAndNoOptionCount = filteredItems.filter(item => item.isDisabled || item.isNoOption === true)
      .length;
    // take disabled items into consideration when checking
    if (
      (!this.data || this.data.length === 0) &&
      this._settings.allowRemoteDataSearch
    ) {
      return false;
    }
    return (
      filteredItems.length === this.selectedItems.length + itemDisabledAndNoOptionCount
    );
  }

  showButton(): boolean {
    if (!this._settings.singleSelection) {
      if (this._settings.limitSelection > 0) {
        return false;
      }
      // this._settings.enableCheckAll = this._settings.limitSelection === -1 ? true : false;
      return true; // !this._settings.singleSelection && this._settings.enableCheckAll && this._data.length > 0;
    } else {
      // should be disabled in single selection mode
      return false;
    }
  }

  itemShowRemaining(): number {
    return this.selectedItems.length - this._settings.itemsShowLimit;
  }

  addSelected(item: ListItem) {
    if (this._settings.singleSelection || item.isNoOption) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      if (this.selectedItems.length === 1 && this.selectedItems[0].isNoOption) {
        this.selectedItems = [];
      }
      this.selectedItems.push(item);
    }
    this.onChangeCallback(this.selectedItems.map(el => el.id));
    this.Select.emit(this.emittedValue(item));
    this.Change.emit(this.emittedValue(this.selectedItems));
  }

  removeSelected(itemSel: ListItem) {
    this.selectedItems.forEach(item => {
      if (itemSel.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onChangeCallback(this.selectedItems.map(el => el.id));
    this.DeSelect.emit(this.emittedValue(itemSel));
    this.Change.emit(this.emittedValue(this.selectedItems));
  }

  emittedValue(val: any): any {
    const selected = [];
    if (Array.isArray(val)) {
      val.map(item => {
        selected.push(this.objectify(item));
        // selected.push(item);
      });
    } else {
      if (val) {
        return this.objectify(val);
      }
    }
    return selected;
  }

  objectify(val: ListItem) {
    if (this._sourceDataType === 'object') {
      const obj = {};
      obj[this._settings.idField] = val.id;
      obj[this._settings.textField] = val.text;
      if (this._sourceDataFields.includes(this._settings.disabledField)) {
        obj[this._settings.disabledField] = val.isDisabled;
      }
      return obj;
    }
    if (this._sourceDataType === 'number') {
      return Number(val.id);
    } else {
      return val.text;
    }
  }

  toggleDropdown(evt) {
    evt.preventDefault();
    if (this.disabled && this._settings.singleSelection) {
      return;
    }
    this._settings.defaultOpen = !this._settings.defaultOpen;
    if (!this._settings.defaultOpen) {
      this.DropDownClose.emit();
    }
  }

  closeDropdown() {
    this._settings.defaultOpen = false;
    // clear search text
    if (this._settings.clearSearchFilter) {
      this.filter.text = '';
    }
    this._settings.itemsShowLimit = this.backupShowlimitValue;
    if (this.toggleShow !== false) {
      this.toggleShowChips();
    }

    // this.itemShowRemaining();
    this.DropDownClose.emit();
  }

  toggleSelectAll() {
    if (this.disabled) {
      return false;
    }
    if (!this.isAllItemsSelected()) {
      // filter out disabled and No Option item first before slicing

      this.selectedItems = this.listFilterPipe
        .transform(this._data, this.filter)
        .filter(item => (!item.isDisabled && item.isNoOption !== true))
        .slice();
      this.SelectAll.emit(this.emittedValue(this.selectedItems));
    } else {
      this.selectedItems = [];
      this.DeSelectAll.emit(this.emittedValue(this.selectedItems));
    }
    this.onChangeCallback(this.selectedItems.map(el => el.id));
  }

  getFields(inputData) {
    const fields = [];
    if (typeof inputData !== 'object') {
      return fields;
    }
    // tslint:disable-next-line:forin
    for (const prop in inputData) {
      fields.push(prop);
    }
    return fields;
  }

  toggleShowChips() {
    this.toggleShow = !this.toggleShow;
  }
}
