import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../service/orderService/order.service';
import { LocalStorageService } from '../../../service/localStoredService/localStored.service';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrl: './other.component.css'
})
export class OtherComponent implements OnInit {
  orders :any = [];


  constructor(private orderService : OrderService,private localStoredService : LocalStorageService){}

  fillOrder(){

    this.orderService.getAllOrderByListId(this.localStoredService.getOrderIds()).subscribe(
      data =>{
        this.orders = data.result;
        console.log(this.orders);
        
      }
    )
  }

ngOnInit(): void {
  let itb = sessionStorage.getItem("itb");;
  if(itb==null){
      window.location.assign("/error")
  }
this.fillOrder();


}

}
