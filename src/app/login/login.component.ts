import { Component } from '@angular/core';
import { LoginService } from '../service/loginService/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;  // Declare loginForm as a FormGroup
  loading = false;

  constructor(private loginService: LoginService, private formBuilder: FormBuilder) {
    // Initialize loginForm with form controls
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  errorRecord : Record<number,string>={

    1702:"User không tồn tại",
    1703:"Mật khẩu không chính xác",
    1704:"Tài khoản đã bị xoá "

  }
  errorMessage =""
  clearErrorMessage(){
     this.errorMessage =""
  }
  async getLogin() {
    console.log("username", this.loginForm.value.username);
    console.log("password", this.loginForm.value.password);  
  
    // Await the login result to ensure synchronization
    const resultLogin = await this.loginService.login(this.loginForm.value.username, this.loginForm.value.password);
    
    if (resultLogin) {
      this.errorMessage = this.errorRecord[resultLogin];
      console.log( this.errorMessage);
      console.log(resultLogin);
    }
    
    console.log(resultLogin);
  }
  

}
