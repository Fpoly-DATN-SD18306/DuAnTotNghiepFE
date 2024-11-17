import { Component } from '@angular/core';
import { LoginService } from '../../../service/loginService/login.service';

@Component({
  selector: 'app-adminview',
  templateUrl: './adminview.component.html',
  styleUrl: './adminview.component.css'
})
export class AdminviewComponent {
  constructor(private loginLogoutService : LoginService){}

  logout(){
    this.loginLogoutService.logout()

  }

}
