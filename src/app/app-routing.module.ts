import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DardosComponent } from './dardos/dardos.component'
import { AgujasComponent } from './agujas/agujas.component'
import { MenuComponent } from './menu/menu.component'
import { BorrachoComponent } from './borracho/borracho.component'
import { BarajaComponent } from './baraja/baraja.component'

const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  },
  {
    path: 'dardos',
    component: DardosComponent,
  },
  {
    path: 'agujas',
    component: AgujasComponent,
  },
  {
    path: 'borracho',
    component: BorrachoComponent,
  },
  {
    path: 'baraja',
    component: BarajaComponent,
  },
  {
    path: '**',
    component: MenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
