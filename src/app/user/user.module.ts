import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserviewComponent } from './component/userview/userview.component';
import { HomeComponent } from './component/home/home.component';
import { MenuComponent } from './component/menu/menu.component';
import { OtherComponent } from './component/other/other.component';
import { CartComponent } from './component/cart/cart/cart.component';



@NgModule({
  declarations: [
    UserviewComponent,
    HomeComponent,
    MenuComponent,
    OtherComponent,
    CartComponent,

  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
