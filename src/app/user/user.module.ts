import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserviewComponent } from './component/userview/userview.component';
import { HomeComponent } from './component/home/home.component';
import { MenuComponent } from './component/menu/menu.component';
import { OtherComponent } from './component/other/other.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserviewComponent,
    HomeComponent,
    MenuComponent,
    OtherComponent,

  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule { }
