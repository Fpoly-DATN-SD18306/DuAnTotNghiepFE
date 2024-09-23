import { Food } from '../../../interface/food/food';
import { Icart } from '../../../interface/cart/iCart';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService   
} from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor( private h:HttpClient,private cookieService: CookieService) {}
  private readonly cartKey: string = 'myCart';
    items: Icart[]=[];
    
    addToCart(f: Food) {
      const cart = this.getCart();
    
      // Tìm xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingProductIndex = cart.findIndex((item: Icart) => item.idFood === f.idFood);
    
      if (existingProductIndex !== -1) {
        // Nếu đã tồn tại, tăng số lượng lên
        cart[existingProductIndex].quantity++;
      } else {
        // Nếu chưa tồn tại, thêm sản phẩm vào giỏ hàng
        cart.push({
          idFood: f.idFood,
          nameFood: f.nameFood,
          price: f.priceFood,
          thumbnail: f.imgFood,
          quantity: 1
        });
      }
    
      this.cookieService.set(this.cartKey, JSON.stringify(cart));
      console.log('Giỏ hàng sau khi thêm:', this.getCart());
    }
   
  getCart() {
    const cartString = this.cookieService.get(this.cartKey);
    return cartString ? JSON.parse(cartString) : [];
  }
  removeFromCart(id: number) {
    const cart = this.getCart();
    const index = cart.findIndex((item: Icart) => item.idFood === id);
    if (index !== -1) {
      cart.splice(index, 1);
      this.cookieService.set(this.cartKey, JSON.stringify(cart));
    }
  }

  updateQuantity(id: number, quantity: number) {
    const cart = this.getCart();
    const item = cart.find((item: Icart) => item.idFood === id);
    if (item) {
      item.quantity = quantity;
      this.cookieService.set(this.cartKey, JSON.stringify(cart));
    }
  }

  calculateTotal():number {
    const cart = this.getCart();
    return cart.reduce((total :number, item : Icart) => total + item.price * item.quantity, 0);
  }

  clearCart() {
    this.cookieService.delete(this.cartKey);
  }
}

