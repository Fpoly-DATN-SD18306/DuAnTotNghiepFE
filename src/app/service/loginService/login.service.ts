
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiRespone } from '../../entity/api-respone';
import { Observable } from 'rxjs';
import { promotionRequest } from '../../entity/request/promotion-request';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  
  url = ApiConfigService.apiUrl

  constructor(private  httpClient : HttpClient,private router :Router){}


   async login(username:string,password:string):Promise<number|void>{
    let obj = 
    { "username": username,
      "password": password
    }
    try {
      // Chuyển `post` thành `Promise`
      const data = await this.httpClient.post<ApiRespone>(this.url + "/api/login", obj).toPromise();
      console.log(data?.result);
      if(data){
                
        let decodeToken: any = jwtDecode(data.result.token);
        localStorage.setItem("jwt",data.result.token)
        localStorage.setItem("UUID",decodeToken.ID)
        console.log(decodeToken.ID);
        console.log(data.result.changedPassword);
        
        if(data.result.changedPassword==false){
          this.router.navigate(["/changepass"])
          return;
        }
        let roleToken = decodeToken.scope
        if(roleToken=="MANAGER"){
          this.router.navigate(["/admin/manager/managerFood/manager"])
        } else if(roleToken=="STAFF"){
          this.router.navigate(["/admin/staff/tableorder_staff/tableorder"])  
        }

      }
      
  } catch (error ) {
    const e = error as HttpErrorResponse;  
      console.log("error",e.error.code);
      return e.error.code
  }

  }
  async logout():Promise<number|void>{
    try {
      let token = localStorage.getItem("jwt")
      if(token){
      var data= await this.httpClient.post<ApiRespone>(this.url + "/api/logout",{"token":token} as object).toPromise();
   
    }
    } catch (error) {
      var e = error as HttpErrorResponse
      return e.error.code;
    } finally  {
      localStorage.removeItem("jwt")
      localStorage.removeItem("UUID")
      window.location.assign("/login")
    }
   
  }
}

