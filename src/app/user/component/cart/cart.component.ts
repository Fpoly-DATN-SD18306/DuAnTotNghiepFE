import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Icart } from '../../../interface/cart/iCart';
import { ApiConfigService } from '../../../service/ApiConfigService';
import { CartService } from '../../../service/cartService/cart.service';
import { Router } from '@angular/router';
import { RequestOrder } from '../../../service/requestOrder.service';
import { verifyTable } from '../../../service/verifyTable.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: Icart[] = [];
  total: number = 0;
  discount: number = 0;
  message: string = '';

  constructor(private cartService: CartService, private changeDetectorRef: ChangeDetectorRef
    , private router: Router,private requestOrderService :  RequestOrder) {}

  ngOnInit(): void {
    this.getAllCart();
    this.calculateTotal();
    console.log("alo");
    
  }

  callOrder(){
    
    this.requestOrderService.postRequestOrder()?.subscribe(
      data=>{
        console.log(data.result)
      }, error =>{
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
      this.total +=  (item.price ) * item.quantity;
    });
    console.log(this.total);
    
  }

  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  onNotify(checkChange: number) {
    console.log(checkChange);
    this.items  = CartService.items
    this.calculateTotal()
  }
}
