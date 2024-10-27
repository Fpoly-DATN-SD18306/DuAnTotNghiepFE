import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiConfigService } from '../../../service/ApiConfigService';

import { CartService } from '../../../service/cartService/cart.service';

import { Icart } from '../../../interface/cart/iCart';

@Component({
  selector: 'app-product-in-cart',
  templateUrl: './product-in-cart.component.html',
  styleUrl: './product-in-cart.component.css'
})
export class ProductInCartComponent {
  @Input() product!: Icart; 
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

 
  constructor(private cdr: ChangeDetectorRef, private cartService: CartService) {}

  
  srcImage = "./img/noImage.jpg";
  hostingImg = ApiConfigService.apiUrlimg;

  quantity =0;
  nodeFood="";

  changeProduct(){
    //  1 has changed 
    this.notify.emit(1);
  }
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

  updateQuantity(idFood:number){
    console.log(this.quantity)
    console.log(idFood);
    this.cartService.updateQuantity(idFood,this.quantity,this.nodeFood)
    this.changeProduct()
  }

  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  show() {
    console.log(this.product)
  }
  ngOnInit(): void {

    console.log();

    if(this.product){
      this.quantity=this.product.quantity
      this.nodeFood=this.product.note

      if(this.product.thumbnail){
      if (this.product.thumbnail.trim() !== "") {
        this.srcImage = this.hostingImg + this.product.thumbnail;
        // this.cdr.detectChanges();
      }
    }
    }
    
  }
}
