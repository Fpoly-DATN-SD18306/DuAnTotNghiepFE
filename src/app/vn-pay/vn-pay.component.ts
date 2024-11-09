import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-vn-pay',
  templateUrl: './vn-pay.component.html',
  styleUrl: './vn-pay.component.css'
})
export class VnPayComponent implements OnInit{
  constructor(private route : ActivatedRoute){}

  datePayment = "";
  RspCode = "";
  bank ="";
  dateTransaction = "";
  Amount = "";
  idOrder = "";
  keyCheck  ="";
  finalCheck  = false;

  checkValid(bank : string,amount: string,idOrder: string,date:String,rsp:string, keyCheckFromBE : string){
    let  codeFE = bank+amount+idOrder+date+rsp
    return codeFE==atob(keyCheckFromBE)
  }
 

  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

   formatDate(dateString: string): string {
    // Lấy từng phần của chuỗi
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; 
    const day = parseInt(dateString.slice(6, 8), 10);
    const hour = parseInt(dateString.slice(8, 10), 10);
    const minute = parseInt(dateString.slice(10, 12), 10);
    const second = parseInt(dateString.slice(12, 14), 10);
  
    const date = new Date(year, month, day, hour, minute, second);
  
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  
 
   
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let RspCode = params['RspCode'];
      let bank = params['bank'];
      let dateTransaction = params['dateTransaction'];
      let Amount = params['Amount'];
      let idOrder = params['idOrder'];
      let keyCheck = params['keyCheck'];
      if (dateTransaction&&RspCode&&bank&&Amount&&idOrder) {
        
        this.finalCheck=this.checkValid(bank,Amount,idOrder,dateTransaction,RspCode,keyCheck)

        this.datePayment = this.formatDate(dateTransaction);
        this.bank=bank;
        this.RspCode=RspCode;
        this.Amount= this.formatPrice(Amount/100);
        this.idOrder=idOrder;
        console.log(this.datePayment);
      } else {
        console.log("Không tìm thấy tham số trong URL.");
      }
    });
  }

}
