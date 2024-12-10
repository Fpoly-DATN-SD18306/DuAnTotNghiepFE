import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './user/component/menu/menu.component';
import { LoginComponent } from './login/login.component';
import { VnPayComponent } from './vn-pay/vn-pay.component';
import { ChangepassComponent } from './changepass/changepass.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'products/:id', component: MenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'changepass', component: ChangepassComponent },
  { path: 'vnpay', component: VnPayComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
