import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerviewparentComponent } from './managerviewparent/managerviewparent.component';
import { ManagerviewTableComponent } from './managerview-table/managerview-table.component';
import { ManagerviewFoodModule } from './managerview-food/managerview-food.module';

const routes: Routes = [{
  path: '', component: ManagerviewparentComponent,
  children: [
   { path: 'managerFood', loadChildren: () => import('./managerview-food/managerview-food.module').then(m => m.ManagerviewFoodModule) },
   { path: 'managerTable', component: ManagerviewTableComponent}
  ]
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerviewRoutingModule { }
