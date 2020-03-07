import { NgModule } from '@angular/core';
import { ComboboxComponent } from './combobox.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from './combobox.directive';
import { ListFilterPipe } from './combobox-filter.pipe';

@NgModule({
  declarations: [ComboboxComponent, ClickOutsideDirective, ListFilterPipe],
  imports: [CommonModule, FormsModule
  ],
  providers: [ListFilterPipe],
  exports: [ComboboxComponent]
})
export class ComboboxModule { }
