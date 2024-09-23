import { CartService } from './../cart/cart.service';


import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Food } from '../../../interface/food/food';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
   products: Food[] = [
    { idFood: 1, nameFood: 'Sản phẩm A', priceFood: 10000, isSelling: true, imgFood: 'food A' },
    { idFood: 2, nameFood: 'Sản phẩm B', priceFood: 20000, isSelling: true, imgFood: 'food B' },
    // ...
  ];
  list = Array(12);
  listType = Array(12);
  constructor(private route:Router,private router:ActivatedRoute,private cartService: CartService){}

  activeLink1: String = '1';

  setActive( type :String ){
    this.activeLink1 = type;
  }

  pickProduct(id : number){
    this.route.navigate(['Product']);
  }
  addToCart(product: Food) {
    this.cartService.addToCart(product);
  }
  findProduct(){
    
  }

}
