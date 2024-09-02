import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { UserviewComponent } from './component/userview/userview.component';



const routes: Routes = [{
  path: '', component: UserviewComponent,
  children: [
    { path: '', component: HomeComponent }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
