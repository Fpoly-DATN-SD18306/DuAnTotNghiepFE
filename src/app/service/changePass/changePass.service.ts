
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiRespone } from '../../entity/api-respone';
import { Observable } from 'rxjs';
import { promotionRequest } from '../../entity/request/promotion-request';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class changepassService{
  
  url = ApiConfigService.apiUrl

  constructor(private  httpClient : HttpClient,private router :Router){}

  header = new HttpHeaders(
    {"Authorization":"Bearer " +  localStorage.getItem("jwt")}
  )


  async changePass(password : string){
    var UUID = localStorage.getItem("UUID")
    let obj = { 
      "idUser" : UUID,
      "password": password
    }
    try {
    var data = await this.httpClient.post<ApiRespone>(this.url+"/api/v1/change-pass",obj,{headers :this.header}).toPromise()
    return null
    }catch (error ) {
      const e = error as HttpErrorResponse;  
        console.log("error",e.error.code);
        return e.error.code
    }
  }

}

