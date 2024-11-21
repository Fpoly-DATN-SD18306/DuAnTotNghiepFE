import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../ApiConfigService';
import { ApiRespone } from '../../entity/api-respone';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  url = ApiConfigService.apiUrl +"/api/invoice";
  constructor(private http: HttpClient) { }
 
 
  public getInvoiceByIdOrder(idOrder : number):Observable<ApiRespone> {
    
    return this.http.get<ApiRespone> (this.url, {params :{"idOrder":idOrder}})
  }
  
  
}
