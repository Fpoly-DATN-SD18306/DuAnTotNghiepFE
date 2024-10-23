import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderprocessingComponent } from './orderprocessing/orderprocessing.component';
import { TableorderStaffComponent } from './tableorder-staff/tableorder-staff.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StaffviewTableOrderRoutingModule } from './staffview-table-order-routing.module';

@NgModule({
    declarations: [
      OrderprocessingComponent,
      TableorderStaffComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatSnackBarModule,
      StaffviewTableOrderRoutingModule
    ]
  })
  export class StaffviewTableOrderModule { }
  