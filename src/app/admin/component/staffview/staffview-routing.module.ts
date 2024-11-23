import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffviewParentComponent } from './staffview-parent/staffview-parent.component';
import { TableorderStaffComponent } from './staffview-table-order/tableorder-staff/tableorder-staff.component';
import { OrderprocessingComponent } from './staffview-table-order/orderprocessing/orderprocessing.component';
import { StaffviewTableOrderModule } from './staffview-table-order/staffview-table-order.module';
import { ShiftInfoComponent } from './shift-info/shift-info.component';


const routes: Routes = [
  {
    path: '', component: StaffviewParentComponent,
    children: [
     { path: 'tableorder_staff', loadChildren: () => import('./staffview-table-order/staffview-table-order.module').then(m => m.StaffviewTableOrderModule)}
    ],
  },
  {path:'ShiftInfo',component:ShiftInfoComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffviewRoutingModule { }
