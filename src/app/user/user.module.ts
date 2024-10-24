import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserviewComponent } from './component/userview/userview.component';
import { HomeComponent } from './component/home/home.component';
import { MenuComponent } from './component/menu/menu.component';
import { OtherComponent } from './component/other/other.component';
import { FileNotFounduserComponent } from './component/file-not-founduser/file-not-founduser.component';



@NgModule({
  declarations: [
    UserviewComponent,
    HomeComponent,
    MenuComponent,
    OtherComponent,
    FileNotFounduserComponent

  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
