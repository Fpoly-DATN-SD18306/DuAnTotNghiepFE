import { Component,OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CategoryFoodEntity } from '../../../../Class/category-food-entity';
import { FoodEntity } from '../../../../Class/food-entity';
import { CategoryServiceService } from '../../../../Service/category-service.service';
import { FoodEntityServiceService } from '../../../../Service/food-entity-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  listCategory!:CategoryFoodEntity[];
  listFood!:FoodEntity[];
  idCategory!:number;
  selectedValue = 0; 
  searchValue: string = '';
  isChecked: boolean = true;
  constructor(private route:Router,
    private router:ActivatedRoute,
    private FoodService:FoodEntityServiceService,
    private CategoryService:CategoryServiceService){}

  activeLink1: String = '1';

  setActive( type :String ){
    this.activeLink1 = type;
  }

  onSubmit() {
    console.log('Search Value:', this.searchValue);
    this.GetFoodEntitybyNameAndid();
  }

  // lấy name và id
  GetFoodEntitybyNameAndid(){
    this.FoodService.getfoodByIdCategoryAndName(this.selectedValue,this.searchValue).subscribe(data => this.listFood = data);
  }

  // lấy id Category
  onCategoryChange(event: any) {
    this.selectedValue = event.target.value;
    console.log("id: "+ this.selectedValue)
    this.getProductByCategory();
  }

  ngOnInit(): void {
      this.getProductByCategory();
      this.getCategoryName();
  }

  // lấy tên Category để đưa vào options
  getCategoryName(){
    this.CategoryService.getCategory().subscribe(data => this.listCategory = data)
  }

  // lấy foodList theo category id
  getProductByCategory(){
    this.FoodService.getFoodByIdCategory(this.selectedValue).subscribe(data => this.listFood = data)
  }

  pickProduct(id : number){
    this.route.navigate(['Product']);
  }
  


  findProduct(){
    
  }

}
