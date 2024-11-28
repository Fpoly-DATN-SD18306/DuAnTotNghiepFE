
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
export class shiftService {

  url = ApiConfigService.apiUrl

  constructor(private http: HttpClient, private router: Router) { }

  header = new HttpHeaders(
    { "Authorization": "Bearer " + localStorage.getItem("jwt") }
  )

  shiftCreate(cashAtStart :number): Observable<ApiRespone> {
    let obj = {
      "idUser": localStorage.getItem("UUID"),
      "cashAtStart": cashAtStart,
      "cashAmountEnd": null,
      "bankAmountEnd": null
    }
    console.log("obj",obj);
    
    return this.http.post<ApiRespone>(this.url + "/api/v1/shift/create", obj,{headers:this.header})
  }

  shiftEnd(cashAmountEnd :number): Observable<ApiRespone> {
    let obj = {
      "idUser": localStorage.getItem("UUID"),
      "cashAtStart": 0,
      "cashAmountEnd": cashAmountEnd,
      "bankAmountEnd": null
    }
    return this.http.post<ApiRespone>(this.url + "/api/v1/shift/end", obj,{headers:this.header})
  }

  EndDay(cashAmountEnd :number): Observable<ApiRespone> {
    let obj = {
      "idUser": localStorage.getItem("UUID"),
      "cashAtStart": 0,
      "cashAmountEnd": cashAmountEnd,
      "bankAmountEnd": null
    }
    return this.http.post<ApiRespone>(this.url + "/api/v1/shift/endDay", obj,{headers:this.header})
  } 

  shiftValid(): Observable<ApiRespone> {
    const idUser = localStorage.getItem("UUID");
    return this.http.post<ApiRespone>(
      `${this.url}/api/v1/shift/valid?idUser=${idUser}`, 
      {}, 
      { headers: this.header }
    );
  }

  infoCheckoutShift(): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(
      `${this.url}/api/v1/shift/infoCheckout`,  
      { headers: this.header }
    );
  }

}

