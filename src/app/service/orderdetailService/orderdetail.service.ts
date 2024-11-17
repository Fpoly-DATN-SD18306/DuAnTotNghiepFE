import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';
import { OrderResponse } from '../../entity/response/order-response';
import { Application } from 'express';
import { OrderDetailResponse } from '../../entity/response/orderdetail-response';

@Injectable({
  providedIn: 'root'
})
export class OrderdetailService {
 url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient) { }

  getOrderDetail(idOrder: number | null, idTable: number| null,): Observable<ApiRespone> {
    let params = new HttpParams();

    if (idOrder !== null && idOrder !== undefined) {
      params = params.set('idOrder', idOrder.toString());
    }

    if (idTable !== null && idTable !== undefined) {
      params = params.set('idTable', idTable.toString());
    }

    return this.http.get<ApiRespone>(`${this.url}/api/v1/orderdetail`, { params });
  }

  
}
