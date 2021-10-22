import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DardosComponent } from './dardos/dardos.component';
import { AgujasComponent } from './agujas/agujas.component';
import { MenuComponent } from './menu/menu.component';
import { BorrachoComponent } from './borracho/borracho.component'

@NgModule({
  declarations: [
    AppComponent,
    DardosComponent,
    AgujasComponent,
    MenuComponent,
    BorrachoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
