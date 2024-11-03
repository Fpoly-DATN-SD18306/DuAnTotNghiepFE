import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../ApiConfigService';
import { ApiRespone } from '../../entity/api-respone';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url = ApiConfigService.apiUrl +"/api/payment-VNPay";
  constructor(private http: HttpClient) { }
 
 
  public postRequestPaymentVNPay(idOrder : number):Observable<ApiRespone> {
    
    return this.http.post<ApiRespone> (this.url, {},{params :{"idOrder":idOrder}})
  }
  
  
}
