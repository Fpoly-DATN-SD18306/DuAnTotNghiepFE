import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerviewRoutingModule } from './managerview-routing.module';
import { ManagerviewparentComponent } from './managerviewparent/managerviewparent.component';

import { ManagerviewFoodComponent } from './managerview-food/managerview-food.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ManagerviewparentComponent,
    ManagerviewFoodComponent
  ],
  imports: [
 
    NgbModule,
    CommonModule,
    FormsModule,ReactiveFormsModule,
    ManagerviewRoutingModule
  ]
})
export class ManagerviewModule { }
