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
    this.route.paramMap.subscribe(() => {
      this.listFoods(); 
    });
  }

  
  listFoods() {
    const idParam = this.route.snapshot.paramMap.get('idcategory');
    const theKeyword = this.route.snapshot.paramMap.get('keyword');
    const theSelling = this.route.snapshot.paramMap.get('isSelling');

    let observable;

    if (theKeyword) {
      observable = this.searchFilterService.searchFood(this.thePageNumber - 1, this.thePageSize, theKeyword);
    } else if (idParam) {
      this.currentCategoryId = +idParam; 
      observable = this.searchFilterService.getFoodListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId);
    } else if (theSelling) {
      observable = this.searchFilterService.getFoodListByisSelling(this.thePageNumber - 1, this.thePageSize, theSelling === 'true');
    } else {
      observable = this.searchFilterService.getFoodPage(this.thePageNumber - 1, this.thePageSize);
    }

    observable.subscribe(
      data => {
        if (data && data._embedded && data._embedded.foodEntities) {
          this.food = data._embedded.foodEntities;
          this.filteredFoods = this.food;
          this.theTotalElements = data.page.totalElements; 
          this.size = this.filteredFoods.length;
          this.number = data.page.number + 1; 
          this.totalPages = data.page.totalPages;
        } else {
          this.filteredFoods = [];
        }
      },
      error => {
        console.error('Error fetching food items', error);
      }
    );
  }

  editProduct(idFood: number) {
    this.router.navigate(['/admin/manager/managerFood/manager', idFood]);
  }

  doSearch(value: string) {
    this.router.navigate([`/admin/manager/managerFood/search/${value}`]).then(() => {
      window.location.reload();
    });
  }

  filterFoodByCategory(event: Event) {
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
}
