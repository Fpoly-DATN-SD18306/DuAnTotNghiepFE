import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../ApiConfigService';
import { ApiRespone } from '../../entity/api-respone';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url = ApiConfigService.apiUrl +"/api";
  constructor(private http: HttpClient) { }
 
 
  public postRequestPaymentVNPay(idOrder : number):Observable<ApiRespone> {
    
    return this.http.post<ApiRespone> (this.url+"/payment-VNPay", {},{params :{"idOrder":idOrder}})
  }


  public postRequestPaymentManual(idOrder : number):Observable<ApiRespone> {
    return this.http.post<ApiRespone> (this.url+"/manual-Pay", {},{params :{"idOrder":idOrder}})
  }
  
  
}
