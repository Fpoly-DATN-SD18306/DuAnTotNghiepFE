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
  
  list = Array(12);
  listType = Array(12);
  constructor(private route:Router,private router:ActivatedRoute,private cartService: CartService){}

  addToCart(product: Food) {
    this.cartService.addToCart(product);
  }
  findProduct(){
    
  }

}
