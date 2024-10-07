import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../../../../service/food.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { foodResponse } from '../../../../../entity/response/food-response';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFilterService } from '../../../../../service/foodService/search-filter.service';
import { Foods } from '../../../../../entity/food/foods';
import { FoodCategory } from '../../../../../entity/category/food-category';
import { CategoryService } from '../../../../../service/categoryService';
import { ApiRespone } from '../../../../../entity/api-respone';
import { Observable } from 'rxjs';
import { error } from 'console';

@Component({
  selector: 'app-listfood',
  templateUrl: './listfood.component.html',
  styleUrls: ['./listfood.component.css']
})
export class ListfoodComponent implements OnInit {
  listFood!: foodResponse[];
  food!: Foods[];
  filteredFoods!: Foods[];
  number = 0;
  totalPages = 0;
  thePageNumber: number = 1;
  thePageSize: number = 20;
  theTotalElements: number = 0;
  size: number = 20;
  currentCategoryId: number = 1;  
  listCate!: FoodCategory[]; 
  nameFoodFilter!: string ;
  nameCategoryFilter!: string ;
  isSellingFilter: string='123';
  constructor(
    private foodService: FoodService,
    private cateService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.filterByCategory();
    this.getAllFoods();
    // this.listFood2(); 
  }


  doSearch(value: string) {
    this.router.navigate([`/admin/manager/managerFood/search/${value}`]).then(() => {
      window.location.reload();
    });
  }

  filterFood(event: Event) {
    const selectedCategoryId = +(event.target as HTMLSelectElement).value;
    this.router.navigate([`/admin/manager/managerFood/category/${selectedCategoryId}`]).then(() => {
      window.location.reload();
    });
  }

  filterisSelling(event: Event) {
    const isSelling = (event.target as HTMLSelectElement).value;
    this.router.navigate([`/admin/manager/managerFood/isselling/${isSelling}`]).then(() => {
      window.location.reload();
    });
  }

  filterByCategory() {
    this.cateService.getAllCate().subscribe(
      data => {
        this.listCate = data.result as FoodCategory[]; 
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }
  listFood2(){

    this.searchFilterService.filterFood(this.nameFoodFilter,this.nameCategoryFilter,this.isSellingFilter,0,20).subscribe(
      data => {
        this.filteredFoods=data.result.content;
        this.theTotalElements = data.result.totalElements;
        this.size = this.filteredFoods.length;
        this.number = data.result.number + 1;
        this.totalPages = data.result.totalPages;
        console.log(this.theTotalElements)
        
        }, 
      error => {console.log(error)}
    )
  };
  getAllFoods() {
    this.searchFilterService.getFoodPage(0,20).subscribe(
      data => {
        this.filteredFoods=data.result.content;
        this.theTotalElements = data.result.totalElements;
        this.size = this.filteredFoods.length;
        this.number = data.result.number + 1;
        this.totalPages = data.result.totalPages;
       console.log(this.filteredFoods)
        }, 
      error => {console.log(error),
        console.log(this.filteredFoods)
      }
    );
    
}
  editProduct(idFood: number) {
    this.router.navigate(['/admin/manager/managerFood/manager', idFood]);
  }

  //   listFood2() {
  //   let observable;

  //   if (this.nameFoodFilter==null && this.nameCategoryFilter==null && this.isSellingFilter==null) {
  //     observable = this.searchFilterService.getFoodPage(
  //       this.thePageNumber - 1,
  //       this.thePageSize
  //     )
    
  //   } else {
  //     observable = this.searchFilterService.filterFood(1,20,this.nameFoodFilter,this.nameCategoryFilter,this.isSellingFilter
  //     );
  //  ;
  
  //   }

  //   observable.subscribe(
  //     data => {
  //       this.filteredFoods=data.result.content;
  //           this.theTotalElements = data.result.totalElements;
  //           this.size = this.filteredFoods.length;
  //           this.number = data.result.number + 1;
  //           this.totalPages = data.result.totalPages;
  //           console.log(this.theTotalElements)
  
  //     },
  //     // error => {

  //     //   this.filteredFoods=[]
  //     // }
  //   );
  // }
}
