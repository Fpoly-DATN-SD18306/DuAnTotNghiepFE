import { CartService } from './../../../service/cartService/cart.service';

import { Component, OnInit, Output, output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Food } from '../../../interface/food/food';
import { verifyTable } from '../../../service/verifyTable.service';
import { FoodService } from '../../../service/foodService/food.service';
import { CategoryService } from '../../../service/categoryService';
import { FoodCategory } from '../../../entity/category/food-category';
import { Foods } from '../../../entity/food/foods';
import { SearchFilterService } from '../../../service/foodService/search-filter.service';

import { MatSnackBar } from '@angular/material/snack-bar';

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
  loadingCallAPI = true;
  loader = true;

  constructor(private route: Router, private router: ActivatedRoute, private filterFoodService: SearchFilterService,
    private cartService: CartService, private foodService: FoodService, private cateService: CategoryService
    , private snackBar: MatSnackBar) { }

  searchFood() {
    if (this.inputSeach != "") {
      this.searching = true;
      this.loadingCallAPI = true;
      this.listSeach = [];
      setTimeout(() => {
        this.filterFoodService.filterFood(this.inputSeach, "", '123', 0, 10).subscribe(
          data => {
            this.loadingCallAPI = false;
            this.listSeach = data.result.content
            console.log(this.listSeach)
          },
          error => {
            this.loadingCallAPI = false;
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

  openToast(status: string) {
    this.snackBar.open
      (status, "Đóng", {
        duration: 4000,
        horizontalPosition: 'start', //  'start', 'end'
        verticalPosition: 'bottom', //  'bottom'
      })
  }

  // addToCart(product: Food) {
  //   this.cartService.addToCart(product);
  // }
  findProduct() {
  }

  getAlldata() {
    this.loader = true;
    let cacheFood = sessionStorage.getItem("cacheFood")
    let cacheCate = sessionStorage.getItem("cacheCate")
    if (cacheFood) {
      this.listFood = JSON.parse(cacheFood)
      console.log(this.listFood);
      this.loader = false;
    } else {
      this.filterFoodService.filterFood("", "", "True",  0, 10000).subscribe(
        data => {
          this.listFood = data.result.content;
          this.loader = false;
          console.log(this.listFood );
          sessionStorage.setItem("cacheFood",JSON.stringify(this.listFood) )
        }
        , error => {
          alert(error)
          this.loader = false;
        }
      )
    }
    if(cacheCate){
      this.listCate = JSON.parse(cacheCate)
      this.loader = false;
    } 
    else{
      this.cateService.getAllCate().subscribe(
        data => {
          this.listCate = data.result;
          sessionStorage.setItem("cacheCate",JSON.stringify(this.listCate))
          this.loader = false;
        }
        , error => {
          console.log(error)
          // alert(error)
          this.loader = false;
        }
      )
    }

  }



  getNotifyFromChild(message: string) {
    console.log(message);
    this.openToast(message)
  }


  open() {
    console.log("alo");

    this.openToast("alo?")
  }

  ngOnInit(): void {
    this.getAlldata();
  }

}
