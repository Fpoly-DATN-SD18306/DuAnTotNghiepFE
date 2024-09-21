import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../../../../service/food.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { foodResponse } from '../../../../../entity/response/food-response';
import { Router } from '@angular/router';


@Component({
  selector: 'app-listfood',
  templateUrl: './listfood.component.html',
  styleUrl: './listfood.component.css'
})
export class ListfoodComponent implements OnInit {
  constructor(private foodService : FoodService
   ,private router : Router,private snackBar: MatSnackBar){}

  listFood !: foodResponse[];
  number=0;
  totalPages=0;
  getAllListFood(page : number){
    this.foodService.getAllList(page).subscribe(
      data=>{
        console.log(data.result)
        this.listFood = data.result.content
        this.number = data.result.number
        this.totalPages = data.result.totalPages
      }
    )
  }

  editProduct(idFood : number){
    console.log("alo")
    this.router.navigate(["/admin/manager/managerFood/manager",idFood]).then(()=>{
      // window.location.reload();
    })
  }

  ngOnInit(): void {
  this.getAllListFood(this.number)
 }


}
