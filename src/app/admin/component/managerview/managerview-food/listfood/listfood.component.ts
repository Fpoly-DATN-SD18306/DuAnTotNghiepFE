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
  thePageNumber: number = 0;
  thePageSize: number = 20;
  theTotalElements: number = 0;
  size: number = 20;
  currentCategoryId: number = 1;
  
  listCate !: any;
  constructor(
    private foodService: FoodService,
    private cateService : CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private searchFilterService: SearchFilterService
  ) {}

  getAllListFood(page: number) {
    this.foodService.getAllList(page).subscribe(
      data => {
        this.listFood = data.result.content;
        this.number = data.result.number;
        this.totalPages = data.result.totalPages;
      },
      error => {
        console.error('Error fetching all food items', error);
      }
    );
  }

  editProduct(idFood: number) {
    this.router.navigate(["/admin/manager/managerFood/manager", idFood]);
  }

  ListAllFood() {
    this.searchFilterService.getFoodList().subscribe(
      data => {
        this.filteredFoods = data;
      },
      error => {
        console.error('Error fetching all food items', error);
      }
    );
  }
  doSearch(value: string) {
      this.router.navigate([`/admin/manager/managerFood/search/${value}`]).then(() => {
        
        window.location.reload();
      });;
  }
  filterFoodByCategory(event: Event) {
    const selectedCategoryId = +(event.target as HTMLSelectElement).value;
    if (selectedCategoryId) {
      this.router.navigate([`/admin/manager/managerFood/category/${selectedCategoryId}`]).then(() => {
        
        window.location.reload();
      });
    } else {
      this.router.navigate(["/admin/manager/managerFood/category"]).then(() => {
        
        window.location.reload();
      });;
    }
  }
  filterisSelling(event: Event) {
    const isSelling = (event.target as HTMLSelectElement).value;
    this.router.navigate([`/admin/manager/managerFood/isselling/${isSelling}`]).then(() => {
      window.location.reload(); 
    });
  }
  
  listFoods() {
    const idParam = this.route.snapshot.paramMap.get('idcategory');
    const theKeyword = this.route.snapshot.paramMap.get('keyword');
    const theSelling = this.route.snapshot.paramMap.get('isSelling');
    if (theKeyword) {
      this.searchFilterService.searchFood(this.thePageNumber, this.thePageSize, theKeyword).subscribe(
        data => {
          if (data && data._embedded && data._embedded.foodEntities) {
            this.food = data._embedded.foodEntities;
            this.filteredFoods = this.food;
            this.thePageNumber = data.page.number;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
            this.size = this.filteredFoods.length;
          } else {
            console.error('No food data or incorrect format', data);
            this.filteredFoods = [];
          }
        },
        error => {
          console.error('Error searching food items', error);
        }
      );
    } else {
      if (!idParam) {
        this.searchFilterService.getFoodPage(this.thePageNumber, this.thePageSize).subscribe(
          data => {
            if (data && data._embedded && data._embedded.foodEntities) {
              this.food = data._embedded.foodEntities;
              this.filteredFoods = this.food;
              this.thePageNumber = data.page.number;
              this.thePageSize = data.page.size;
              this.theTotalElements = data.page.totalElements;
              this.size = this.filteredFoods.length;
            } else {
              console.error('No food data or incorrect format', data);
              this.filteredFoods = [];
            }
          },
          error => {
            console.error('Error fetching paginated food list', error);
          }
        );
      } else {
        this.currentCategoryId = idParam ? +idParam : 1;
        this.searchFilterService.getFoodListPaginate(this.thePageNumber, this.thePageSize, this.currentCategoryId).subscribe(
          data => {
            if (data && data._embedded && data._embedded.foodEntities) {
              this.food = data._embedded.foodEntities;
              this.filteredFoods = this.food;
              this.thePageNumber = data.page.number;
              this.thePageSize = data.page.size;
              this.theTotalElements = data.page.totalElements;
              this.size = this.filteredFoods.length;
            } else {
              console.error('No food data or incorrect format', data);
              this.filteredFoods = [];
            }
          },
          error => {
            console.error('Error fetching food items by category', error);
          }
        );
      }if (theSelling) {
        this.searchFilterService.getFoodListByisSelling(this.thePageNumber, this.thePageSize, theSelling === 'true').subscribe(
          data => {
            if (data && data._embedded && data._embedded.foodEntities) {
              this.food = data._embedded.foodEntities;
              this.filteredFoods = this.food;
              this.thePageNumber = data.page.number;
              this.thePageSize = data.page.size;
              this.theTotalElements = data.page.totalElements;
              this.size = this.filteredFoods.length;
            } else {
              console.error('No food data or incorrect format', data);
              this.filteredFoods = [];
            }
          },
          error => {
            console.error('Error fetching food items by selling status', error);
          }
        );
      }
    }
  }


  filterByCategory() {

      this.cateService.getAllCate().subscribe(
        data=>{
         
          this.listCate = data.result as ApiRespone;
          console.log(this.listCate)
        }, 
        error =>{
          console.log(error)
        }
  
      )
    
    
  }

  ngOnInit(): void {
   
    this.ListAllFood();
    this.filterByCategory();
    this.route.paramMap.subscribe(() => {
      this.listFoods();
    });
  }
}
