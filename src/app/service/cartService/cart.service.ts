import { Food } from '../../interface/food/food';
import { Icart } from '../../interface/cart/iCart';

import { HttpClient } from '@angular/common/http';
import { Inject,PLATFORM_ID,EventEmitter, Injectable, ChangeDetectorRef } from '@angular/core';

import { isPlatformBrowser, PlatformLocation } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cartKey: string = 'myCart';
  items: Icart[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedCart = localStorage.getItem(this.cartKey);
      if (storedCart) {
        this.items = JSON.parse(storedCart);
      }
    }
  }

  updateQuantity(id: number, quantity: number) {
    if (isPlatformBrowser(this.platformId)) {
      const item = this.items.find((item: Icart) => item.idFood === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem(this.cartKey, JSON.stringify(this.items));
      }
    }
  }

  addToCart(f: Icart) {
    if (isPlatformBrowser(this.platformId)) {
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
    }
  }

  getCart(): Icart[] {
    if (isPlatformBrowser(this.platformId)) {
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
    }
    return [];
  }

  removeFromCart(id: number) {
    if (isPlatformBrowser(this.platformId)) {
      const index = this.items.findIndex((item: Icart) => item.idFood === id);

      if (index !== -1) {
        this.items.splice(index, 1);
        localStorage.setItem(this.cartKey, JSON.stringify(this.items));
        console.log('Sản phẩm đã được xóa khỏi giỏ hàng:', this.items);
      } else {
        console.error('Không tìm thấy sản phẩm cần xóa');
      }
    }
  }

  clearCart() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.cartKey);
      this.items = [];
      console.log('Giỏ hàng đã được xóa.');
    }
  }
}
