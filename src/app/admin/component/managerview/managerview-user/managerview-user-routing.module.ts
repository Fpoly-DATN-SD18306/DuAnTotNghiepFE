import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListuserComponent } from './listuser/listuser.component';
import { ManagerviewUserComponent } from './managerview-user.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';

const routes: Routes = [{
  path: '', component: ManagerviewUserComponent, children: [
    { path: 'managerUser', component: ManagerUserComponent },
    { path: 'users', component: ListuserComponent },
    { path: 'managerUser/:id', component: ManagerUserComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerviewUserRoutingModule { }
