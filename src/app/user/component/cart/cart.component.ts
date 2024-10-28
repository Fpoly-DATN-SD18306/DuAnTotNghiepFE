import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Icart } from '../../../interface/cart/iCart';
import { ApiConfigService } from '../../../service/ApiConfigService';
import { CartService } from '../../../service/cartService/cart.service';
import { Router } from '@angular/router';

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

  constructor(private cartService: CartService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.getAllCart();
    this.calculateTotal();
    console.log("alo");
    
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
