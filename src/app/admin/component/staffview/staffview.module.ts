import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffviewRoutingModule } from './staffview-routing.module';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StaffviewTableOrderComponent } from './staffview-table-order/staffview-table-order.component';
import { StaffviewParentComponent } from './staffview-parent/staffview-parent.component';


@NgModule({
  declarations: [
    StaffviewParentComponent,
    StaffviewTableOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StaffviewRoutingModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class StaffviewModule { }
