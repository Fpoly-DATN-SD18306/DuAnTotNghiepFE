import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerviewRoutingModule } from './managerview-routing.module';
import { ManagerviewparentComponent } from './managerviewparent/managerviewparent.component';
import { ManagerviewTableComponent } from './managerview-table/managerview-table.component';


@NgModule({
  declarations: [
    ManagerviewparentComponent,
    ManagerviewTableComponent
  ],
  imports: [
    CommonModule,
    ManagerviewRoutingModule
  ]
})
export class ManagerviewModule { }
