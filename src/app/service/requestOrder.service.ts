import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiRespone } from '../entity/api-respone';
import { Icart } from '../interface/cart/iCart';
import { CartService } from './cartService/cart.service';
import { OrderRequest } from '../entity/request/order-request';
import { verifyTable } from './verifyTable.service';
import { response } from 'express';
import { WebsocketService } from './websocketService/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class RequestOrder {
  url = ApiConfigService.apiUrl+"/api/order";
  urlOrder = ApiConfigService.apiUrl+"/api/v1/order";
  urlDeleteOrder = ApiConfigService.apiUrl+"/api/v1/order/delete";

  constructor(private http: HttpClient,private cartService : CartService,private  verifyTable : verifyTable, private websocketService: WebsocketService
  ) { }

  postRequestOrder():Observable<ApiRespone>|null{
   let items: Icart[] = this.cartService.getCart()
   let itemsOrder  : OrderRequest[] =[]
   let idTable = sessionStorage.getItem('itb')
   console.log(idTable)
   console.log('itemscart: '+idTable)
   if(items){
    items.forEach(Element=>{
      itemsOrder.push(new OrderRequest(Element.idFood,Element.quantity,Element.note,Element.nameFood))
    })
    if(idTable){  
      return this.http.post<ApiRespone>(this.url,itemsOrder  ,{params : {"idTable" : idTable} })
      .pipe(tap(response => {
        this.websocketService.sendOrderUpdate(response.result); // Gửi thông tin đơn hàng
      }),
      catchError(error => {
        console.error('Error:', error); 
        return throwError(error);
      }))
    }
   }
   return null;

  }
  

  postNewOrder(itemsOrder: OrderRequest[], idTable: number): Observable<ApiRespone> {

    if(idTable){  
      return this.http.post<ApiRespone>(this.url,itemsOrder  ,{params : {"idTable" : idTable} })
      .pipe(tap(response => {
        this.websocketService.sendOrderUpdate(response.result); 
      }),
      catchError(error => {
        console.error('Error:', error); 
        return throwError(error);
      }))
    }
   

    return new Observable(); 
  }

   updateOrder(idOrder: number, itemsOrder: OrderRequest[]): Observable<ApiRespone> {
    if (idOrder ) {
     
      return this.http.put<ApiRespone>(`${this.urlOrder}/${idOrder}`, itemsOrder)
        .pipe(
          tap(response => {
            this.websocketService.sendOrderUpdate(response.result); 
          }),
          catchError(error => {
            console.error('Error:', error);
            return throwError(error);
          })
        );
    }
    return new Observable();
  }
  deleteOrder(idOrder: number): Observable<void> {
    return this.http.delete<void>(`http://192.168.0.193:8080/api/v1/order/delete/${idOrder}`);
  }
  
}
