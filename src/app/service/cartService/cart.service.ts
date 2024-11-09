import { Icart } from '../../interface/cart/iCart';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FoodService } from '../foodService/food.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cartKey: string = 'cart';
  static items: Icart[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private foodService : FoodService) {
    if (isPlatformBrowser(this.platformId)) {
      const storedCart = sessionStorage.getItem(this.cartKey);
      if (storedCart) {
        CartService.items = JSON.parse(storedCart);
      }
    }
  }

  updateQuantity(id: number, quantity: number,noteFood  : string) {
    if (isPlatformBrowser(this.platformId)) {
      const item = CartService.items.find((item: Icart) => item.idFood === id);
      if (item && quantity>0) {
        item.quantity = quantity;
        item.note =noteFood;
        sessionStorage.setItem('cart', JSON.stringify(CartService.items));
      } else if (item && quantity<1) {
        this.removeFromCart(item.idFood)
      }
    }
  }

  addToCart(f: Icart) {
    if (isPlatformBrowser(this.platformId)) {
    const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existingProductIndex = cartItems.findIndex((item: Icart) => item.idFood === f.idFood);

      if (existingProductIndex !== -1) {
        CartService.items[existingProductIndex].quantity += f.quantity;
      } else {
        CartService.items.push({
          idFood: f.idFood,
          nameFood: f.nameFood,
          price: f.price,
          thumbnail: f.thumbnail,
          quantity: f.quantity,
          note: f.note,
  
        });
      }

    CartService.items = cartItems;
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('Giỏ hàng sau khi thêm:', this.getCart());
    }
  }

  getCart(): Icart[] {
    if (isPlatformBrowser(this.platformId)) {
      const cartItemsString =  sessionStorage.getItem('cart');
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
      const index = CartService.items.findIndex((item: Icart) => item.idFood === id);

      if (index !== -1) {
        CartService.items.splice(index, 1);
        sessionStorage.setItem(this.cartKey, JSON.stringify(CartService.items));
        console.log('Sản phẩm đã được xóa khỏi giỏ hàng:', CartService.items);
      } else {
        console.error('Không tìm thấy sản phẩm cần xóa');
      }
    }
  }

  clearCart() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.cartKey);
      CartService.items = [];
      console.log('Giỏ hàng đã được xóa.');
    }
  }
}
