
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiRespone } from '../../entity/api-respone';
import { Observable } from 'rxjs';
import { promotionRequest } from '../../entity/request/promotion-request';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  
  url = ApiConfigService.apiUrl

  constructor(private  httpClient : HttpClient){}


   async login(username:string,password:string):Promise<number|void>{
    let obj = 
    { "username": username,
      "password": password
    }
    try {
      // Chuyển `post` thành `Promise`
      const data = await this.httpClient.post<ApiRespone>(this.url + "/api/login", obj).toPromise();
      console.log(data);
      
  } catch (error ) {
    const e = error as HttpErrorResponse;  
      console.log("error",e.error.code);
      return e.error.code
  }

  }

}

