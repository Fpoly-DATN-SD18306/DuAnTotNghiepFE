import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';
import { WebsocketService } from '../websocketService/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient, private websocketService : WebsocketService) { }


  getOrder(idOrder: number): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/order/${idOrder}`);
  } 

  confirmOrder(idOrder: number | null, idTable: number| null,): Observable<ApiRespone> {
    let params = new HttpParams();

    if (idOrder !== null && idOrder !== undefined) {
      params = params.set('idOrder', idOrder.toString());
    }

    if (idTable !== null && idTable !== undefined) {
      params = params.set('idTable', idTable.toString());
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
}
