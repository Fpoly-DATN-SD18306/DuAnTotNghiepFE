import { ChangeDetectorRef, Component } from '@angular/core';
import { CartService } from '../../../service/cartService/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestOrder } from '../../../service/requestOrder.service';
import { WebsocketService } from '../../../service/websocketService/websocket.service';
import { Icart } from '../../../interface/cart/iCart';
import { OrderdetailService } from '../../../service/orderdetailService/orderdetail.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {


  constructor(private cartService: CartService,
    private changeDetectorRef: ChangeDetectorRef, 
    private router: Router,
    private requestOrderService: RequestOrder,
    private websocketService: WebsocketService,
    private orderDetailService : OrderdetailService,
    private route: ActivatedRoute
  ) { }
  isConfirmed: boolean = false; 
  iserror : boolean = false; 

  items:any [] = [];
  total: number = 0;
  discount: number = 0;
  message: string = '';
  idOrder  = -999;
  ngOnInit(): void {
    this.getAllCart();
    
    this.websocketService.connect()
  }

  getIdOrder():number{
    let result !:number;
    this.route.queryParams.subscribe(
      params =>{
        console.log("alo",params["id"]);
        result = params["id"]
        ;
      }
    )
    return result
  }

  getAllCart() {
    
    this.orderDetailService.getOrderDetail(this.getIdOrder(),null).subscribe(
      data =>{
        this.items = data.result
        console.log(this.items);
        this.items.forEach((item) => {
          console.log(item.price);
          this.total += (item.price) * item.quantity;
          this.discount += ((item.price) * item.quantity) *(item.discount/100);
        });
        console.log(this.total);
      }
    )
  }

  formatPrice(price: number) {

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

}
