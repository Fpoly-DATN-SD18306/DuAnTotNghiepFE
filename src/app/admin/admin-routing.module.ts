import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminviewComponent } from './component/adminview/adminview.component';






const routes: Routes = [{
  path: '', component: AdminviewComponent,
  children: [
    { path: 'manager', loadChildren: () => import('./component/managerview/managerview.module').then(m => m.ManagerviewModule) },
    { path: 'staff', loadChildren: () => import('./component/staffview/staffview.module').then(m => m.StaffviewModule) },
    { path: 'manager/managerFood', loadChildren: () => import('./component/managerview/managerview.module').then(m => m.ManagerviewModule) }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
