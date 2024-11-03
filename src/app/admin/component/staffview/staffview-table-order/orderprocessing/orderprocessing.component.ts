import { Component } from '@angular/core';
import { PaymentService } from '../../../../../service/paymentService/verifyTable.service';

@Component({
  selector: 'app-orderprocessing',
  templateUrl: './orderprocessing.component.html',
  styleUrl: './orderprocessing.component.css'
})
export class OrderprocessingComponent {

  constructor(private paymentService : PaymentService){}

  paymentPaythod = "vnpay"

  paymentOrder(){
    this.paymentService.postRequestPaymentVNPay(2).subscribe(
      data =>{
        console.log(data);
        // window.location.assign(data.result.urlToRedirect)
        window.open(data.result.urlToRedirect)
      }, error =>{
        console.log(error);
        
      }
    );
  }

}
