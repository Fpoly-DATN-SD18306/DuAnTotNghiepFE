import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { TestUIAdminComponent } from './component/test-uiadmin/test-uiadmin.component';


@NgModule({
  declarations: [
    TestUIAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
