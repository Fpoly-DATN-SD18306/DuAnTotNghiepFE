import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../ApiConfigService';
import { ApiRespone } from '../../entity/api-respone';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url = ApiConfigService.apiUrl +"/api";
  constructor(private http: HttpClient) { }
 
  header = new HttpHeaders(
    {"Authorization":"Bearer " +  localStorage.getItem("jwt")}
  )

  public postRequestPaymentVNPay(idOrder : number,idPromotion:number):Observable<ApiRespone> {
    
    return this.http.post<ApiRespone> (this.url+"/payment-VNPay", {},{params :{"idOrder":idOrder,"idPromotion":idPromotion},headers:this.header})
  }


  public postRequestPaymentManual(idOrder : number,idPromotion:number):Observable<ApiRespone> {
    
    return this.http.post<ApiRespone> (this.url+"/manual-Pay", {},{params :{"idOrder":idOrder,"idPromotion":idPromotion},headers:this.header})
  }
  
  
}
