import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { MenuComponent } from './component/menu/menu.component';
import { ProductInfoComponent } from './component/product-info/product-info.component';
import { UserviewComponent } from './component/userview/userview.component';



const routes: Routes = [{
  path: '', component: UserviewComponent,
  children: [
    { path: '', component: HomeComponent },
    { path:'Menu', component: MenuComponent},
    { path : 'Product', component: ProductInfoComponent}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
