import {  ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() statusAdd = new EventEmitter<string>();
  constructor(private cdr: ChangeDetectorRef,private cartService: CartService, private snackBar: MatSnackBar){}
  srcImage = "./img/noImage.jpg";
  hostingImg = ApiConfigService.apiUrlimg;

  quantity =1;
  noteOrder="";
  validQuantity(event: Event) {
    let inputData = event.target as HTMLInputElement;
  
    if (inputData.valueAsNumber < 0 || Number.isNaN(inputData.valueAsNumber) || inputData.valueAsNumber % 1 !== 0) {
      alert("Nhập phải đúng số nguyên")
      this.quantity = 0;  
    } else {
      this.quantity = inputData.valueAsNumber; 
    }
  }
  

  throwStatusForParent(message:string){
    this.statusAdd.emit(message);
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

  show() {
   try {
    if(this.quantity>0){
    let cartItem : Icart={
      idFood : this.product.idFood,
      nameFood: this.product.nameFood,
      price: this.product.priceFood,
      quantity: this.quantity,
      thumbnail:this.product.imgFood, 
      note:this.noteOrder,

    }
    this.cartService.addToCart(cartItem);
    console.log("đơn hàng  đã thêm: ", this.cartService.getCart());
    this.throwStatusForParent("Đã thêm vào đơn hàng!")
    this.quantity=0;
  } 
  } catch (error) {
    
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
      if(this.product.imgFood)
      if (this.product.imgFood.trim() !== "") {
        this.srcImage = this.hostingImg + this.product.imgFood;
        // this.cdr.detectChanges();
      }
    }
    
  }


}
