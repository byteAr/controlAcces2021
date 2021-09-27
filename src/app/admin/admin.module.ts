import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TableComponent } from './componets/table/table.component';
import { SearchComponent } from './componets/search/search.component';
import { AltaComponent } from './pages/alta/alta.component';




@NgModule({
  declarations: [
    DashboardComponent,
    TableComponent,
    SearchComponent,
    AltaComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,   
  ]
})
export class AdminModule { }
