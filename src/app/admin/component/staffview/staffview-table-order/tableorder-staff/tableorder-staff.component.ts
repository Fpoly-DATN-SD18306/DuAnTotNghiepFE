import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TableService } from '../../../../../service/tableService/table.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tableResponse } from '../../../../../entity/response/table-response';
import { error } from 'console';
import { tableStatusResponse } from '../../../../../entity/response/tableStatus-response';
import { WebsocketService } from '../../../../../service/websocketService/websocket.service';
import { OrderRequest } from '../../../../../entity/request/order-request';
import { OrderdetailService } from '../../../../../service/orderdetailService/orderdetail.service';
import { Router } from '@angular/router';
import { OrderResponse } from '../../../../../entity/response/order-response';
import { OrderDetailResponse } from '../../../../../entity/response/orderdetail-response';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from '../../../../../service/loginService/login.service';
import { shiftService } from '../../../../../service/shift/Shift.service';


@Component({
  selector: 'app-tableorder-staff',
  templateUrl: './tableorder-staff.component.html',
  styleUrl: './tableorder-staff.component.css'
})
export class TableorderStaffComponent implements OnInit {

  constructor(private tableservice: TableService, private snackBar: MatSnackBar,
    private websocketservice: WebsocketService,
    private orderdetailsService: OrderdetailService,
    private router: Router, private loginService : LoginService,
    private shiftService : shiftService
    ) { }

   

  listTable!: tableResponse[]
  listStatuses! : tableStatusResponse[]

  listOrderDetails: OrderDetailResponse[] = [];
  selectedTable: tableResponse | null = null;
  order: OrderResponse | null = null;


  getAllTables(){
    this.tableservice.getAllTablesNotDeleted().subscribe(data =>{
      console.log("Data", data);
      this.listTable = data.result
    },error => {
      console.log("Error", error);
    })
  }



// Thông báo có đơn hàng vừa được đặt 
  notificationOrder(){
    this.websocketservice.onMessage().subscribe(message => {
        if(message){
          this.getAllTables()
        }
    });
  }
  
    selectTable(item: tableResponse) {
    if (item.currentOrderId !== null) {
    // this.selectedTable = item;
      this.fetchOrderDetails(item.currentOrderId, item.idTable);
      this.router.navigate(['/admin/staff/tableorder_staff/orderprocessing', item.currentOrderId, item.idTable]);
    } else {
      this.router.navigate(['/admin/staff/tableorder_staff/orderprocessing/', item.idTable]);
      console.log("item no has idorder", item)
    // Xóa dữ liệu đơn hàng cũ
      this.listOrderDetails = [];
      this.order = null;
    }
  }

  // click orderdetails
  fetchOrderDetails(idOrder: number | null, idTable: number | null) {
    if (idOrder !== null) {
      this.orderdetailsService.getOrderDetail(idOrder, null).subscribe(
        data => {
          this.listOrderDetails = data.result;
          console.log('Order Details:', data.result);
        },
        error => {
          console.error('Error fetching order details', error);
        }
      );
    } else if (idTable !== null) {
      this.orderdetailsService.getOrderDetail(null, idTable).subscribe(
        data => {
          this.listOrderDetails = data.result;
          console.log('Order Details:', data.result);
        },
        error => {
          console.error('Error fetching order details', error);
        }
      );
    } else {
      console.log('Both idOrder and idTable are null');
    }
  }
// ****************************************************************

  getAllStatuses(){
    this.tableservice.getAllStatuses().subscribe(data => {
      console.log("Data", data)
      this.listStatuses = data.result
    },error => {
      console.log("Error", error)
    })
  }


  updateStatus(id: number, status: string) {
    console.log("Updating Table:", id, status); // Xem giá trị id và status
    this.tableservice.updateTableStatus(id, status).subscribe(data => {
      console.log("Updated Table:", data);
      this.getAllTables()
      this.openTotast('Đã cập nhật trạng thái!')
    }, error => {
      this.openTotast('Đã cập nhật trạng thái!')
      console.log("Error", error);
    })
  }


  //Thông báo setting
  openTotast(status: string) {
    this.snackBar.open
      (status, "Đóng", {
        duration: 4000,
        horizontalPosition: 'start', //  'start', 'end'
        verticalPosition: 'bottom', //  'bottom'
      })
  }

// =================đầu ca ================

currentDate = new Date().toLocaleString(); // Hiển thị ngày giờ hiện tại
totalAmount = 0;

// Danh sách mệnh giá và số lượng tờ (ban đầu)
denominations = [
  { value: 1000, quantity: 0 },
  { value: 2000, quantity: 0 },
  { value: 5000, quantity: 0 },
  { value: 10000, quantity: 0 },
  { value: 50000, quantity: 0 },
  { value: 100000, quantity: 0 },
  { value: 200000, quantity: 0 },
  { value: 500000, quantity: 0 }
];

absNum(num :number){
  return Math.abs(num)
}

// Hàm tính tổng tiền
calculateTotal() {

  this.totalAmount = this.denominations.reduce(
    (total, denom) => total + denom.value * Math.abs(denom.quantity),
    0
  );
}

// Hàm lưu thông tin (mô phỏng)
save() {
  console.log(this.totalAmount);
  this.shiftService.shiftCreate(this.totalAmount).subscribe(
    data =>{
      console.log(data);
      window.location.reload()
    },
    error =>{
      console.log(error);
  
       confirm("Có ca khác đang làm việc !")
       this.loginService.logout()
    }
  );
}

cancel(){
this.loginService.logout()
}

openModalDauCa(){
  var btnOpen = document.getElementById("btnModalDauCa")
  let jwt = localStorage.getItem("jwt")
  let resultValidShift = false;
  if(jwt){
  let decodeToken: any = jwtDecode(jwt);
  let roleToken = decodeToken.scope
  this.shiftService.shiftValid().subscribe(
    data =>{
      console.log(data);
      
    },
    error=>{
      console.log(error);
      if(roleToken!="MANAGER"){
        btnOpen?.click();
      }
      
    }
  )
 
}

}
  ngOnInit(): void {
    this.getAllTables()
    this.getAllStatuses()
    this.notificationOrder()
    this.openModalDauCa()
  }

}
