import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRespone } from '../entity/api-respone';
import { Icart } from '../interface/cart/iCart';
import { CartService } from './cartService/cart.service';
import { OrderRequest } from '../entity/request/order-request';

@Injectable({
  providedIn: 'root'
})
export class RequestOrder {
  url = ApiConfigService.apiUrl+"/api/order";
  constructor(private http: HttpClient,private cartService : CartService) { }

  postRequestOrder():Observable<ApiRespone>|null{
   let items: Icart[] = this.cartService.getCart()
   let itemsOrder  : OrderRequest[] =[]
   if(items){
    items.forEach(Element=>{
      itemsOrder.push(new OrderRequest(Element.idFood,Element.quantity,Element.nameFood))
    })
    return this.http.post<ApiRespone>(this.url,itemsOrder )
   }
   return null;

  }

}
