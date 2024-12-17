import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Foods } from '../../../entity/food/foods';
import { ApiConfigService } from '../../../service/ApiConfigService';
import { CartService } from '../../../service/cartService/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Icart } from '../../../interface/cart/iCart';

@Component({
  selector: 'app-product-ngang',
  templateUrl: './product-ngang.component.html',
  styleUrl: './product-ngang.component.css'
})
export class ProductNgangComponent  implements OnInit{
  @Input() product !: Foods;

  constructor(private cdr: ChangeDetectorRef,private cartService: CartService, private snackBar: MatSnackBar){}

  
  srcImage = "./img/noImage.jpg";
  hostingImg = ApiConfigService.apiUrlimg;

  quantity =0;
  noteOrder="";


  limitedStringShow(text : string){
    let maxStringShow = 30;
    return text.substring(0,maxStringShow)
  }

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

  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
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
     this.quantity=0;
   } 
   } catch (error) {
     
     console.log(error)
    }
   }
  ngOnInit(): void {

    console.log();

    if(this.product){
      if(this.product.imgFood)
      if (this.product.imgFood?.trim() !== "") {
        this.srcImage = this.hostingImg + this.product.imgFood;
        // this.cdr.detectChanges();
      }
    }
    
  }

}
