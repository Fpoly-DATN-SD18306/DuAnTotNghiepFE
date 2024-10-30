import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { MenuComponent } from './component/menu/menu.component';
import { ProductInfoComponent } from './component/product-info/product-info.component';
import { UserviewComponent } from './component/userview/userview.component';
import { CartComponent } from './component/cart/cart.component';
import { FileNotFounduserComponent } from './component/file-not-founduser/file-not-founduser.component';



const routes: Routes = [{
  
  path: '', component: UserviewComponent,
  children: [
    { path : '', component: HomeComponent },
    { path : 'Menu', component: MenuComponent},
    { path : 'Product', component: ProductInfoComponent},
    { path : 'Cart', component: CartComponent}
  ]
  },
  { path : 'error', component: FileNotFounduserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
