import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
// import { ComboboxModule } from 'angular8simplecombobox';
// import {ComboboxModule} from 'combobox';
import {ComboboxModule} from '../../projects/combobox/src/lib/combobox.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ComboboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
