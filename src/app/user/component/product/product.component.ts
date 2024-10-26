import {  ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Foods } from '../../../entity/food/foods';
import { ApiConfigService } from '../../../service/ApiConfigService';
import { CartService } from '../../../service/cartService/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Icart } from '../../../interface/cart/iCart';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  @Input() product !: Foods;

  constructor(private cdr: ChangeDetectorRef,private cartService: CartService, private snackBar: MatSnackBar){}

  
  srcImage = "./img/tomdutlo.jpg";
  hostingImg = ApiConfigService.apiUrlimg;

  quantity =0;
  note="acb";
  validQuantity(event:Event){
    let inputData = event.target as HTMLInputElement
 
    if(inputData.valueAsNumber<0 ||Number.isNaN(inputData.valueAsNumber)){
      this.quantity=0;
   
    } else {
      this.quantity=inputData.valueAsNumber;  
   
    }
  }

  upQuantity(){
    this.quantity++;
    console.log(this.quantity)
  }
  downQuantity(){
    if(this.quantity>0){
      this.quantity--;
      console.log(this.quantity)
    }
  }
  openToast(status : string){
    this.snackBar.open
    (status,"Đóng",{
      duration:4000,
      horizontalPosition: 'start', //  'start', 'end'
      verticalPosition: 'bottom', //  'bottom'
    })
  }
  show() {
   try {
   this.upQuantity();
   this.downQuantity();
    let cartItem : Icart={
      idFood : this.product.idFood,
      nameFood: this.product.nameFood,
      price: this.product.priceFood,
      quantity: this.quantity,
      thumbnail:this.product.imgFood, 
      note:this.note
    }
    this.cartService.addToCart(cartItem);
    console.log("đơn hàng  đã thêm: ", cartItem);
   
    this.quantity=0;
    this.openToast("Đã thêm vào đơn hàng!")
   } catch (error) {
    this.openToast("Thêm vào đơn hàng thất b!")
    console.log(error)
   }
  }
  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  // show() {
  //   console.log(this.product)
  // }
  ngOnInit(): void {

    console.log();

    if(this.product){
      if (this.product.imgFood.trim() !== "") {
        this.srcImage = this.hostingImg + this.product.imgFood;
        // this.cdr.detectChanges();
      }
    }
    
  }


}
