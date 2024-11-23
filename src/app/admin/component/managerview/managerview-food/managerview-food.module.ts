import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerviewFoodRoutingModule } from './managerview-food-routing.module';
import { ListfoodComponent } from './listfood/listfood.component';
import { ManagerfoodComponent } from './managerfood/managerfood.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ListfoodComponent,
    ManagerfoodComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatSnackBarModule,
    ManagerviewFoodRoutingModule
  ]
})
export class ManagerviewFoodModule { }
