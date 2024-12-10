import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { changepassService } from '../service/changePass/changePass.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrl: './changepass.component.css'
})
export class ChangepassComponent {

  loginForm: FormGroup;  // Declare loginForm as a FormGroup

  constructor(private formBuilder: FormBuilder,private changepassService : changepassService
    ,private router :Router) {
    // Initialize loginForm with form controls
    this.loginForm = this.formBuilder.group({
      newPass: ["", [Validators.required,Validators.minLength(8)]],
      confirmPass: ["", [Validators.required]]
    });
  } 
  errorMess =""
  loading=false
  successMess:string|null=null
  checkEqual(){  
    if(this.loginForm.value.newPass!=this.loginForm.value.confirmPass){
      this.errorMess="Mật khẩu xác nhận không trùng khớp !"
    } else {
       this.errorMess=""
    }
  }

  async changepass(){
   var result = await this.changepassService.changePass(this.loginForm.value.confirmPass)

    if(result==null){
      this.successMess="Đã thay đổi mật khẩu thành công ! Sẽ điều hướng về trang chủ trong giây lát ^^"
      setTimeout(()=>{
        this.router.navigate(["/admin/staff/tableorder_staff/tableorder"]) 
      },3000)
    } else {


    }

  }
  


  errorRecord : Record<number,string>={

   

  }
  errorMessage =""
  clearErrorMessage(){
     this.errorMessage =""
  }
 
}
