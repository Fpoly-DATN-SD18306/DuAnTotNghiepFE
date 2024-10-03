import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffviewTableOrderComponent } from './staffview-table-order.component';
import { OrderprocessingComponent } from './orderprocessing/orderprocessing.component';
import { TableorderStaffComponent } from './tableorder-staff/tableorder-staff.component';

const routes: Routes = [{
    path: '', component: StaffviewTableOrderComponent, children: [
      { path: 'orderprocessing', component : OrderprocessingComponent  },
      { path: 'tableorder', component : TableorderStaffComponent  },
      
     ]
  }];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class StaffviewTableOrderRoutingModule { }
  