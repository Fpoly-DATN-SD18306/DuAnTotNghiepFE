import {  ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Foods } from '../../../entity/food/foods';
import { ApiConfigService } from '../../../service/ApiConfigService';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  @Input() product !: Foods;

  constructor(private cdr: ChangeDetectorRef){}

  
  srcImage = "./img/noImage.jpg";
  hostingImg = ApiConfigService.apiUrlimg;

  quantity =0;

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
    console.log(this.product)
  }
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
