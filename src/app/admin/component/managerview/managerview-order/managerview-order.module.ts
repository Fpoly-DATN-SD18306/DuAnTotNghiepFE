import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerviewOrderRoutingModule } from './managerview-order-routing.module';
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
    ManagerviewOrderRoutingModule
  ]
})
export class ManagerviewOrderModule { 
  
}
