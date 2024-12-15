import { Injectable } from '@angular/core';
import { StompService, StompConfig, StompRService, StompHeaders } from '@stomp/ng2-stompjs';
import { Subject } from 'rxjs';
import { OrderRequest } from '../../entity/request/order-request';
import { Icart } from '../../interface/cart/iCart';
import { HttpHeaders } from '@angular/common/http';
import { ApiConfigService } from '../ApiConfigService';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private messageSubject = new Subject<string>();
  private PaymentMessageSubject = new Subject<string>();
  private confirmOrderSubject = new Subject<any>();
  private messageCallStaff = new Subject<any>();
  private messageCallPayment = new Subject<any>();

  private readonly endpoint = ApiConfigService.apiUrl + '/ws/my-websocket-endpoint';

  private stompService: StompService;

  constructor() {
    this.stompService = new StompService(this.getStompConfig());
    this.stompService.activate();
  }

  private getStompConfig(): StompConfig {
    return {
      url: () => new SockJS(this.endpoint), // URL kết nối với SockJS
      headers: { // Thay connectHeaders bằng headers
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      heartbeat_in: 0, // Heartbeat incoming (ms)
      heartbeat_out: 20000, // Heartbeat outgoing (ms)
      reconnect_delay: 5000, // Delay giữa các lần reconnect (ms)
      debug: true
     
    };
  }
  
  

  // Subscribe to a topic
  private subscribeToTopic(topic: string, callback: (message: string) => void) {
    this.stompService.subscribe(topic).subscribe((message) => {
      if (message.body) {
        callback(message.body);
      }
    });
  }

  connect() {
    this.subscribeToTopic('/topic/paymentVNPay', (message) => {
      console.log('Payment VNPay:', message);
      this.PaymentMessageSubject.next(message);
    });

    this.subscribeToTopic('/topic/postorder', (message) => {
      console.log('Order update:', message);
      this.messageSubject.next(message);
    });

    this.subscribeToTopic('/topic/confirmorder', (message) => {
      console.log('Order confirmation:', JSON.parse(message));
      this.confirmOrderSubject.next(JSON.parse(message));
    });

    this.subscribeToTopic('/topic/callStaff', (message) => {
      console.log('Call Staff:', message);
      this.messageCallStaff.next(message);
    });

    this.subscribeToTopic('/topic/payment', (message) => {
      console.log('Call Payment:', message);
      this.messageCallPayment.next(message);
    });
  }

  // Send messages
  sendOrderUpdate(order: OrderRequest) {
    this.stompService.publish({
      destination: '/app/api/order',
      body: JSON.stringify(order),
    });
  }

  sendItemCart(item: Icart[]) {
    this.stompService.publish({
      destination: '/app/api/order',
      body: JSON.stringify(item),
    });
  }

  sendConfirmOrder(order: OrderRequest) {
    this.stompService.publish({
      destination: '/app/api/v1/order',
      body: JSON.stringify(order),
    });
  }

  sendCallStaff(idTable: number) {
    this.stompService.publish({
      destination: `/app/api/order/${idTable}`,
    });
  }

  sendCallPayment(idTable: number) {
    this.stompService.publish({
      destination: `/app/api/order/payment/${idTable}`,
    });
  }

  // Observables for message subscriptions
  onConfirmMessage() {
    return this.confirmOrderSubject.asObservable();
  }

  onMessage() {
    return this.messageSubject.asObservable();
  }

  onPaymentMessage() {
    return this.PaymentMessageSubject.asObservable();
  }

  onMessCallStaff() {
    return this.messageCallStaff.asObservable();
  }

  onMessCallPayment() {
    return this.messageCallPayment.asObservable();
  }
}
