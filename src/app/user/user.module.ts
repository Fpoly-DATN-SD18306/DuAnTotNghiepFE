import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserviewComponent } from './component/userview/userview.component';
import { HomeComponent } from './component/home/home.component';
import { MenuComponent } from './component/menu/menu.component';
import { OtherComponent } from './component/other/other.component';
import { FileNotFounduserComponent } from './component/file-not-founduser/file-not-founduser.component';
import { ProductComponent } from './component/product/product.component';
import { FormsModule } from '@angular/forms';
import { ProductNgangComponent } from './component/product-ngang/product-ngang.component';
import { CartComponent } from './component/cart/cart.component';
import { ProductInCartComponent } from './component/product-in-cart/product-in-cart.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';






@NgModule({
  declarations: [
    UserviewComponent,
    HomeComponent,
    MenuComponent,
    OtherComponent,
    FileNotFounduserComponent,
    OtherComponent,
    ProductComponent,
    ProductNgangComponent,
    CartComponent,
    ProductInCartComponent,
    


  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class UserModule { }
