import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../../../service/table.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tableResponse } from '../../../../../entity/response/table-response';
import { error } from 'console';
import { tableStatusResponse } from '../../../../../entity/response/tableStatus-response';

@Component({
  selector: 'app-tableorder-staff',
  templateUrl: './tableorder-staff.component.html',
  styleUrl: './tableorder-staff.component.css'
})
export class TableorderStaffComponent implements OnInit {

  constructor(private tableservice: TableService, private snackBar: MatSnackBar) { }

  showToast: boolean = false;

  listTable!: tableResponse[]
  listStatuses! : tableStatusResponse[]

  getAllTables(){
    this.tableservice.getAllTablesNotDeleted().subscribe(data =>{
      console.log("Data", data);
      this.listTable = data.result
    },error => {
      console.log("Error", error);
    })
  }

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
      this.ngOnInit()
      this.openTotast('Đã cập nhật trạng thái!')
    }, error => {
      this.openTotast('Đã cập nhật trạng thái!')
      console.log("Error", error);
    });
  }


  //thông báo đơn hàng
  showToastWithTimeout(timeout: number) {
    this.showToast = true; // Hiển thị toast
    setTimeout(() => {
      this.showToast = false; // Ẩn toast sau thời gian đã chỉ định
    }, timeout);
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


  ngOnInit(): void {
    this.getAllTables()
    this.getAllStatuses()
  }
}
