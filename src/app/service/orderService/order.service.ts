import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';
import { WebsocketService } from '../websocketService/websocket.service';
import { foodResponse } from '../../entity/response/food-response';
import { OrderRequest } from '../../entity/request/order-request';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient, private websocketService : WebsocketService) { }


  getOrder(idOrder: number): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/order/${idOrder}`);
  } 

  confirmOrder(idOrderOld: number | null, idOrderNew: number| null): Observable<ApiRespone> {
    let params = new HttpParams();

    if (idOrderOld !== null && idOrderOld !== undefined) {
      params = params.set('idOrderOld', idOrderOld.toString());
    }

    if (idOrderNew !== null && idOrderNew !== undefined) {
      params = params.set('idOrderNew', idOrderNew.toString());
    }

    const urlWithParams = `${this.url}/api/v1/order?${params.toString()}`;
    // return this.http.post<ApiRespone>(urlWithParams, { })
    return this.http.post<ApiRespone>(urlWithParams, { }).pipe(tap(res => {
      this.websocketService.sendConfirmOrder(res.result)
    }), catchError(error => {
      console.error('Error:', error); 
      return throwError(error);
    }))
  }


  createNewOrder(itemOrderrequest: OrderRequest[], idTable: number):Observable<ApiRespone>|null{
     if(idTable){  
       return this.http.post<ApiRespone>(`${this.url}/api/v1/order/create`,itemOrderrequest  ,{params : {"idTable" : idTable} })
     }
     return null;
    }

    updateOrder(idOrder: number, itemOrderrequest: OrderRequest): Observable<ApiRespone> {
      return this.http.put<ApiRespone>(`${this.url}/api/v1/order/${idOrder}`, itemOrderrequest);
    }

    updateOrderDetailQuantity(idOrder: number, idOrderDetail: number, newQuantity: number) {
      const url = `${this.url}/api/v1/order/${idOrder}/orderdetails/${idOrderDetail}`;
      return this.http.put(url, newQuantity); // Gửi newQuantity trực tiếp
    }

    removeOrderDetail(idOrderDetail: number):Observable<ApiRespone>{
      return this.http.delete<ApiRespone>(`${this.url}/api/v1/order/${idOrderDetail}`);
    }

    cancelOrder( idOld:  number| null, idNew: number | null,  cancellationReason: String):Observable<ApiRespone>{
      let params = new HttpParams();
      if (idOld !== null && idOld !== undefined) {
        params = params.set('idOld', idOld.toString());
      }
      
      if (idNew !== null && idNew !== undefined) {
        params = params.set('idNew', idNew.toString());
      }
    
      return this.http.put<ApiRespone>(`${this.url}/api/v1/order/cancel?${params.toString()}`, cancellationReason);
    }

  }

