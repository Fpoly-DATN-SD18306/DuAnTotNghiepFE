import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestUIAdminComponent } from './component/test-uiadmin/test-uiadmin.component';

const routes: Routes = [
  {path :"", component : TestUIAdminComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
