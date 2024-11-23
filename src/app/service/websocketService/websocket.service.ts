import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { OrderRequest } from '../../entity/request/order-request';
import { Subject } from 'rxjs';
import { Cartitem } from '../../interface/cart/cartitem';
import { Icart } from '../../interface/cart/iCart';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private messageSubject = new Subject<string>(); 
  private PaymentMessageSubject = new Subject<string>();
  private confirmOrderSubject = new Subject<any>();
  constructor() { }
  
  private stompClient: any
  private readonly endpoint = ApiConfigService.apiUrl + "/ws/my-websocket-endpoint"
  header = new HttpHeaders(
    {"Authorization":"Bearer " +  localStorage.getItem("jwt")}
  )
  connect(){
    const socket = new SockJS(this.endpoint);
    console.log('endpoint:', this.endpoint)
    this.stompClient = Stomp.over(socket)
    this.stompClient.connect({}, (frame:any) => {
      this.subscribeToPostOrder()
     this.subscribeToConfirmOrder()
     this.subcribeTolistenPayment()
    },{headers:this.header})
    
  }
  // cacth payment
  private subcribeTolistenPayment(){
    this.stompClient.subscribe('/topic/paymentVNPay',(message:any) =>{
      if (message.body) {
        console.log('Payment VNPay:', JSON.parse(message.body));
        this.PaymentMessageSubject.next(message.body);
      }

    },{headers:this.header})
  }

  // Phương thức để lắng nghe và xử lý thông báo từ topic/postorder
  private subscribeToPostOrder() {
    this.stompClient.subscribe('/topic/postorder', (message: any) => {
      if (message.body) {
        console.log('Order update:', JSON.parse(message.body));
        this.messageSubject.next(message.body);
      }
    },{headers:this.header});
  }

  // Phương thức để lắng nghe và xử lý thông báo từ topic/confirmorder
  // private subscribeToConfirmOrder() {
  //   this.stompClient.subscribe('/topic/confirmorder', (message: any) => {
  //     if (message.body) {
  //       console.log('Order confirmation:', JSON.parse(message.body));
  //       this.confirmOrderSubject.next(JSON.parse(message.body));
  //       this.messageSubject.next(message.body);
  //     }
  //   });
  // }
  private subscribeToConfirmOrder() {
    this.stompClient.subscribe('/topic/confirmorder', (message: any) => {
      if (message.body) {
        console.log('Order confirmation:', JSON.parse(message.body));
        this.confirmOrderSubject.next(JSON.parse(message.body));
        this.messageSubject.next(message.body);
      }
    },{headers:this.header});
  }

  sendOrderUpdate(order: OrderRequest) {
    this.stompClient.send('/app/api/order', {}, JSON.stringify(order)); // Gửi thông tin đơn hàng đến broker
  }

  sendItemCart(item : Icart[]){
    this.stompClient.send('/app/api/order', {}, item); // Gửi thông tin đơn hàng đến broker
  }
  
  sendConfirmOrder(order: OrderRequest) {
    this.stompClient.send('/app/api/v1/order', {}, JSON.stringify(order)); // Gửi thông tin đơn hàng đến broker
  }
  
  onMessage() {
    return this.messageSubject.asObservable(); // Trả về Observable để lắng nghe
  }

  onPaymentMessage(){
    return this.PaymentMessageSubject.asObservable();
  }
  onConfirmOrderMessage() {
    return this.confirmOrderSubject.asObservable(); // Trả về Observable để lắng nghe
  }
}
