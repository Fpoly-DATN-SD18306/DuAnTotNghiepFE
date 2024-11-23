import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerviewparentComponent } from './managerviewparent/managerviewparent.component';
import { ManagerviewTableComponent } from './managerview-table/managerview-table.component';
import { ManagerviewFoodModule } from './managerview-food/managerview-food.module';
import { ManagerviewVoucherComponent } from './managerview-voucher/managerview-voucher.component';
import { ManagerviewReportComponent } from './managerview-report/managerview-report.component';

const routes: Routes = [{
  path: '', component: ManagerviewparentComponent,
  children: [
   { path: 'managerFood', loadChildren: () => import('./managerview-food/managerview-food.module').then(m => m.ManagerviewFoodModule) },
   { path: 'managerTable', component: ManagerviewTableComponent},
   {path: 'managerVoucher', component: ManagerviewVoucherComponent},
   {path: 'managerReport', component: ManagerviewReportComponent},
   { path: 'managerUser', loadChildren: () => import('./managerview-user/managerview-user.module').then(m => m.ManagerviewUserModule) }
  ]
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerviewRoutingModule { }
