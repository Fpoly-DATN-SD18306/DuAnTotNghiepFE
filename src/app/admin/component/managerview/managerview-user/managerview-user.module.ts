import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ListuserComponent } from './listuser/listuser.component';
import { ManagerviewUserRoutingModule } from './managerview-user-routing.module';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { LoaderSharedModule } from '../../../../loader-shared/loader-shared.module';


@NgModule({
  declarations: [
    ListuserComponent,
    ManagerUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatSnackBarModule,
    ManagerviewUserRoutingModule,
    LoaderSharedModule
  ]
})
export class ManagerviewUserModule { }
