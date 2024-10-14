import { CartService } from './../cart/cart.service';


import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Food } from '../../../interface/food/food';
import { FoodService } from '../../../service/foodService/food.service';
import { CategoryService } from '../../../service/categoryService';
import { FoodCategory } from '../../../entity/category/food-category';
import { Foods } from '../../../entity/food/foods';
import { SearchFilterService } from '../../../service/foodService/search-filter.service';
import { error } from 'console';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  listCate: FoodCategory[] = []
  listFood: Foods[] = []
  listSeach: Foods[] = []
  inputSeach = "";
  searching = false;
  loadingCallAPI=true;

  constructor(private route: Router, private router: ActivatedRoute, private filterFoodService: SearchFilterService,
    private cartService: CartService, private foodService: FoodService, private cateService: CategoryService) { }

  searchFood() {
    if (this.inputSeach != "") {
      this.searching = true;
      this.loadingCallAPI=true;
      this.listSeach = [];
      setTimeout(() => {
        this.filterFoodService.filterFood(this.inputSeach, "", '123', 0, 1000000).subscribe(
          data => {
            this.loadingCallAPI=false;
            this.listSeach = data.result.content
            console.log(this.listSeach)
          },
          error => {
            this.loadingCallAPI=false;
            console.log(error)
            alert("lỗi")
            alert(error.message)
          }

        )

      }, 1000)

    } else {
      this.searching = false;

    }
  }

  clearFormSearch() {
    this.inputSeach = ""
    this.searching = false;

  }

  addToCart(product: Food) {
    this.cartService.addToCart(product);
  }
  findProduct() {
  }

  getAlldata() {
    this.foodService.getAllList().subscribe(
      data => {
        this.listFood = data.result.content;
        // console.log(this.listFood);
      }
      , error => {
        console.log(error)

      }
    )

    this.cateService.getAllCate().subscribe(
      data => {
        this.listCate = data.result;
        console.log(this.listCate);
      }
      , error => {
        console.log(error)

      }
    )
  }
  ngOnInit(): void {
    this.getAlldata();
  }

}
