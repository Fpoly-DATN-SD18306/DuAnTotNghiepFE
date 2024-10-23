import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerviewTableRoutingModule } from './managerview-table-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    
    MatSnackBarModule,
    ManagerviewTableRoutingModule
  ]
})
export class ManagerviewTableModule { }
