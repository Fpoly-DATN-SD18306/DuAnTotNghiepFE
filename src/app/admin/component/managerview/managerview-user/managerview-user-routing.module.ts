import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListuserComponent } from './listuser/listuser.component';
import { ManagerviewUserComponent } from './managerview-user.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { RoleGuardService } from '../../../../service/authService/RoleGuard.service';

const routes: Routes = [{
  path: '', component: ManagerviewUserComponent, children: [
    { path: 'managerUser', component: ManagerUserComponent,canActivate:[RoleGuardService], data:{expectedRole :['MANAGER', 'STAFF']} },
    { path: 'users', component: ListuserComponent ,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"}},
    { path: 'managerUser/:id', component: ManagerUserComponent,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"} },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerviewUserRoutingModule { }
