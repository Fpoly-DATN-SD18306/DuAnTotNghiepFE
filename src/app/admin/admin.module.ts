import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminviewComponent } from './component/adminview/adminview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Router, RouterModule } from '@angular/router';






@NgModule({
  declarations: [

    AdminviewComponent,

    


  ],
  imports: [
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    RouterModule  ]
})
export class AdminModule { }
