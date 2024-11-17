import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiRespone } from '../entity/api-respone';
import { Icart } from '../interface/cart/iCart';
import { CartService } from './cartService/cart.service';
import { OrderRequest } from '../entity/request/order-request';
import { verifyTable } from './verifyTable.service';
import { response } from 'express';
import { WebsocketService } from './websocketService/websocket.service';
import { IpServiceService } from './ipService/ip-service.service';

@Injectable({
  providedIn: 'root'
})
export class RequestOrder {
  currentIpCustomer : string = ''
  url = ApiConfigService.apiUrl+"/api/order";
  constructor(private http: HttpClient,
    private cartService : CartService,
    private  verifyTable : verifyTable, 
    private websocketService: WebsocketService,
    private ipService : IpServiceService
  ) { this.getIp()}

   //Get IP
   getIp(){
    this.ipService.getIpCustomer().subscribe((data:any) => {
      this.currentIpCustomer = data.ip
      console.log('chackCHange: ',data.ip)
    })
  }

  postRequestOrder():Observable<ApiRespone>|null{
   let items: Icart[] = this.cartService.getCart()
   let itemsOrder  : OrderRequest[] =[]
   let idTable = sessionStorage.getItem('itb')
   let ipCustomer = this.currentIpCustomer
   console.log(idTable)
   console.log('itemscart: '+idTable)
   if(items){
    items.forEach(Element=>{
      itemsOrder.push(new OrderRequest(Element.idFood,Element.quantity,Element.note))
      console.log('Element: ',Element)
    })
    if(idTable){  
      return this.http.post<ApiRespone>(this.url,itemsOrder  ,{params : {"idTable" : idTable, "ipCustomer" : ipCustomer}})
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
}
