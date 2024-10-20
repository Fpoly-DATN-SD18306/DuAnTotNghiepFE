import { Food } from '../../interface/food/food';
import { Icart } from '../../interface/cart/iCart';

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, ChangeDetectorRef } from '@angular/core';

import { isPlatformBrowser, PlatformLocation } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cartKey: string = 'myCart';
 
    items: Icart[]=[];
  constructor(private platformLocation: PlatformLocation) {
    // const storedCart = localStorage.getItem(this.cartKey);
    // if (storedCart) {
    //   this.items = JSON.parse(storedCart);
    // }
  }
  updateQuantity(id: number, quantity: number) {
    const cart = this.getCart();
    const item = this.items.find((item: Icart) => item.idFood === id);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(this.cartKey, JSON.stringify(this.items));
    }
  }
    
    addToCart(f: Icart) {
      const cart = this.getCart();    
      const existingProductIndex = this.items.findIndex((item: Icart) => item.idFood === f.idFood);
    
      if (existingProductIndex !== -1) {
        this.items[existingProductIndex].quantity += f.quantity;
      } else {
 
        this.items.push({
          idFood: f.idFood,
          nameFood: f.nameFood,
          price: f.price,
          thumbnail: f.thumbnail,
          quantity: f.quantity,
          note: f.note
        });
        
      }
      localStorage.setItem(this.cartKey, JSON.stringify(this.items));
      console.log('Giỏ hàng sau khi thêm:', this.getCart());
      // console.log('tổng tiền giỏ hàng:', this.calculateTotal());
      
    }

    getCart(): Icart[] {
      if (typeof localStorage !== 'undefined') {
        const cartItemsString = localStorage.getItem(this.cartKey);
        if (cartItemsString) {
          try {
            return JSON.parse(cartItemsString);
          } catch (error) {
            console.error('Error parsing cart items:', error);
            return [];
          }
        } else {
          return [];
        }
      } else {
        console.error('localStorage is not supported');
       
        return [];
      }
    }
    removeFromCart(id: number) {
      const cart = this.getCart();
      const index = cart.findIndex((item: Icart) => item.idFood === id); // Sử dụng cart thay vì this.items
    
      if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.items = cart; // Cập nhật lại this.items
        console.log('Sản phẩm đã được xóa khỏi giỏ hàng:', this.items);
      } else {
        console.error('Không tìm thấy sản phẩm cần xóa');
      }
    }
  // localStorage.setItem(this.cartKey, JSON.stringify(cart));

// Trong CartService
// updateQuantity(item: Icart) {
//   const index = this.items.findIndex(i => i.idFood === item.idFood);

//   if (index !== -1) {
//     this.items[index].quantity = item.quantity;
//   }

//   localStorage.setItem(this.cartKey, JSON.stringify(this.items));
// }
  // calculateTotal():number {
  //   const cart = this.getCart();
  //   return this.items.reduce((total :number, item : Icart) => total + item.price * item.quantity, 0);
  // }

  clearCart() {
    localStorage.clear();
    this.getCart();
  }
    
}
