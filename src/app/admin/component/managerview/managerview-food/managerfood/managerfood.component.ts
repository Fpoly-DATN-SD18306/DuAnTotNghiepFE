import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../../../../service/foodService/food.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../../service/categoryService';
import { error } from 'console';
import { ApiRespone } from '../../../../../entity/api-respone';
import { foodRequest } from '../../../../../entity/request/food-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { foodResponse } from '../../../../../entity/response/food-response';


@Component({
  selector: 'app-managerfood',
  templateUrl: './managerfood.component.html',
  styleUrl: './managerfood.component.css'
})
export class ManagerfoodComponent implements OnInit {

  constructor(private foodService : FoodService,private cateService : CategoryService
            , private formBuilder : FormBuilder, private router : ActivatedRoute,private snackBar: MatSnackBar
            
          ){}
   
    productForm !: FormGroup
    listCate !: any;
    idFoodNeedUpdate !: Number;
    selectedFile !: File;

  srcImage="./img/noImage.jpg";
   hostingImg = "http://localhost:8080/images/"
  changeImage(event : Event){
    const input = event.target as HTMLInputElement;

    if(input.files){
      console.log(input.files[0])
      this.selectedFile = input.files[0]
      this.srcImage = URL.createObjectURL(input.files[0])
      
    }

  }

  openToast(status : string){
    this.snackBar.open
    (status,"Đóng",{
      duration:4000,
      horizontalPosition: 'end', //  'start', 'end'
      verticalPosition: 'bottom', //  'bottom'
    })
  }

  postFood(){

    let food = new foodRequest(
      this.productForm.value.nameFood,
      this.productForm.value.priceFood,
      this.productForm.value.isSelling=="True"?true:false,
      this.productForm.value.note,
      this.productForm.value.idCategory,
      this.productForm.value.discount
    )

    console.log(food)

    this.foodService.postFood(food,this.selectedFile).subscribe(
      data=>{
        console.log("ok  done!")
        this.openToast("Thêm mới Thành Công");

      },error =>{
        console.log(error)
        this.openToast("Thêm mới Không thành công");
      }
    )

  }

  putFood(){

    let food = new foodRequest(
      this.productForm.value.nameFood,
      this.productForm.value.priceFood,
      this.productForm.value.isSelling=="True"?true:false,
      this.productForm.value.note,
      this.productForm.value.idCategory,
      this.productForm.value.discount
    )

    console.log(food)

    this.foodService.putFood(food,this.selectedFile,this.idFoodNeedUpdate).subscribe(
      data=>{
        console.log("ok  done!")
        this.openToast("Sửa  Thành Công");

      },error =>{
        console.log(error)
        this.openToast("Sửa Không thành công");
      }
    )

  }

  getListCate(){
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
  

  reLoad(){
    window.location.assign("/admin/manager/managerFood/manager");
  }

  refreshForm(){
    this.productForm = this.formBuilder.group({
      nameFood:['',Validators.required],
      priceFood:['',[Validators.required,Validators.min(0)]], 
      isSelling:['True',[Validators.required]],
      idCategory:['',[Validators.required]],
      note: [''],
      discount: ['',[Validators.required,Validators.min(0),Validators.max(100)]],
      imageFile: ['']
      
  
    })
  }

ngOnInit(): void {
  this.getListCate()

  this.refreshForm()

  this.router.params.subscribe(
    param =>{
      let foodId = param['id']
      let foodResponse !: foodResponse;
      if(foodId!= undefined){
        this.foodService.getById(foodId).subscribe(
          data=>{
            foodResponse =data.result;
            console.log(foodResponse)
            this.idFoodNeedUpdate = foodResponse.idFood;
            this.productForm = this.formBuilder.group({
              nameFood:[foodResponse.nameFood,Validators.required],
              priceFood:[foodResponse.priceFood,[Validators.required,Validators.min(0)]], 
              discount :[foodResponse.discount,[Validators.required,Validators.min(0),Validators.max(100)]],
              isSelling:[foodResponse.isSelling,[Validators.required]],
             
              idCategory:[foodResponse.idCategory,[Validators.required]],
              note: [foodResponse.note],
              imageFile: [foodResponse.imgFood]
          
            })
            if(foodResponse.imgFood!=null){
            if(foodResponse.imgFood.trim()!==""){
            
              this.srcImage=this.hostingImg+foodResponse.imgFood;
            }
          }


          }
        )

      }

    }
  )

}

}
