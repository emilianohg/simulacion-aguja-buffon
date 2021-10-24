import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DardosComponent } from './dardos/dardos.component';
import { AgujasComponent } from './agujas/agujas.component';
import { MenuComponent } from './menu/menu.component';
import { BorrachoComponent } from './borracho/borracho.component';
import { BarajaComponent } from './baraja/baraja.component';
import { CardComponent } from './baraja/card/card.component';
import { PlayerComponent } from './baraja/player/player.component'
import { ChartsModule } from 'ng2-charts'

@NgModule({
  declarations: [
    AppComponent,
    DardosComponent,
    AgujasComponent,
    MenuComponent,
    BorrachoComponent,
    BarajaComponent,
    CardComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
