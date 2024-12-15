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
import { LoaderComponent } from '../../../../loader/loader.component';
import { LoaderSharedModule } from '../../../../loader-shared/loader-shared.module';


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
    ManagerviewFoodRoutingModule,
    LoaderSharedModule
  ]
})
export class ManagerviewFoodModule { }
