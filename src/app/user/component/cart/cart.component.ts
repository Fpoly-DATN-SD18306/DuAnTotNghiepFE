import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Icart } from '../../../interface/cart/iCart';
import { ApiConfigService } from '../../../service/ApiConfigService';
import { CartService } from '../../../service/cartService/cart.service';
import { Router } from '@angular/router';
import { RequestOrder } from '../../../service/requestOrder.service';
import { verifyTable } from '../../../service/verifyTable.service';
import { Subscription } from 'rxjs';

import { WebsocketService } from '../../../service/websocketService/websocket.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  isConfirmed: boolean = false; // Biến điều kiện để kiểm soát hiển thị thông báo xác nhận 


  items: Icart[] = [];
  total: number = 0;
  discount: number = 0;
  message: string = '';
  private notificationSubscription: Subscription | undefined;

  constructor(private cartService: CartService,
    private changeDetectorRef: ChangeDetectorRef, 
    private router: Router,
    private requestOrderService: RequestOrder,
    private websocketService: WebsocketService

  ) { }

  ngOnInit(): void {
    this.getAllCart();
    this.calculateTotal();
    this.websocketService.connect()
  }



  // ******End Notification*****

  callOrder() {
    this.requestOrderService.postRequestOrder()?.subscribe(
      data => {
        this.isConfirmed = true
        sessionStorage.removeItem('cart')
        this.getAllCart()
        CartService.items = [];
      }, error => {
        console.log(error)
      }
    )
  }

  getAllCart() {
    this.items = this.cartService.getCart();
    this.changeDetectorRef.detectChanges();
  }

  calculateTotal() {
    this.total = 0
    this.items.forEach((item) => {
      console.log(item.price);
      this.total += (item.price) * item.quantity;
    });
    console.log(this.total);
  }

  formatPrice(price: number) {

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  onNotify(checkChange: number) {
    console.log('chackCHange: ',checkChange);
    this.items = CartService.items
    this.calculateTotal()
  }
}
