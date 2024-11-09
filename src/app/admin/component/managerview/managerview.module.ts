import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerviewRoutingModule } from './managerview-routing.module';
import { ManagerviewparentComponent } from './managerviewparent/managerviewparent.component';

import { ManagerviewFoodComponent } from './managerview-food/managerview-food.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ManagerviewTableComponent } from './managerview-table/managerview-table.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ManagerviewVoucherComponent } from './managerview-voucher/managerview-voucher.component';



@NgModule({
  declarations: [
    ManagerviewparentComponent,
    ManagerviewFoodComponent,
    ManagerviewTableComponent,
    ManagerviewVoucherComponent,

  ],
  imports: [
 
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    ManagerviewRoutingModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class ManagerviewModule { }
