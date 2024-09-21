import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerviewFoodComponent } from './managerview-food.component';
import { ListfoodComponent } from './listfood/listfood.component';
import { ManagerfoodComponent } from './managerfood/managerfood.component';

const routes: Routes = [{
  path: '', component: ManagerviewFoodComponent, children: [
    { path: 'foods', component : ListfoodComponent  },
    { path: 'manager', component : ManagerfoodComponent  },
    { path: 'manager/:id', component : ManagerfoodComponent  },
   ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerviewFoodRoutingModule { }
