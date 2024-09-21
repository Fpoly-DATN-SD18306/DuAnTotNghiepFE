import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminviewComponent } from './component/adminview/adminview.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [

    AdminviewComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
