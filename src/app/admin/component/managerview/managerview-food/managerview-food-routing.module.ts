import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerviewFoodComponent } from './managerview-food.component';
import { ListfoodComponent } from './listfood/listfood.component';
import { ManagerfoodComponent } from './managerfood/managerfood.component';
import { RoleGuardService } from '../../../../service/authService/RoleGuard.service';

const routes: Routes = [{
  path: '', component: ManagerviewFoodComponent, children: [
    { path: 'foods', component: ListfoodComponent ,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"}},
    { path: 'manager', component: ManagerfoodComponent ,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"}},
    { path: 'manager/:id', component: ManagerfoodComponent ,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"} },
    { path: 'search/:keyword', component: ListfoodComponent ,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"} },
    { path: 'category/:idcategory', component: ListfoodComponent ,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"} },
    { path: 'isselling/:isSelling', component: ListfoodComponent ,canActivate:[RoleGuardService], data:{expectedRole :"MANAGER"} },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerviewFoodRoutingModule { }
