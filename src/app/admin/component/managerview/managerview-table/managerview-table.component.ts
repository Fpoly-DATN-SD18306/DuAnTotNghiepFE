import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../../service/table.service';
import { Router } from '@angular/router';
import { tableResponse } from '../../../../entity/response/table-response';
import { QrcodeService } from '../../../../service/qrcode.service';
import { qrCodeResponse } from '../../../../entity/response/qrcode-response';
import { error, table } from 'console';
import { ApiRespone } from '../../../../entity/api-respone';
import { FormGroup } from '@angular/forms';
import { tabelRequest } from '../../../../entity/request/table-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { qrCodeRequest } from '../../../../entity/request/qrcode-request';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-managerview-table',
  templateUrl: './managerview-table.component.html',
  styleUrl: './managerview-table.component.css'
})
export class ManagerviewTableComponent implements OnInit {

  listTableContaiQR! : tableResponse[]
  itemTable?: tableResponse
  listTable!: tableResponse[]
  keyTable!: number;
  currentPage: number = 0
  pagesize: number = 17
  totalPages: number = 0
  pages: number[] = []
  sortOrder: string = 'asc';

//*** */
  status : string = ''

  tableData: tabelRequest = {
    nameTable: '',
    locked: false
  }

  constructor(private tableserive: TableService, private qrcodeservice: QrcodeService, private router: Router,
    private snackBar: MatSnackBar
  ) { }

  // TABLE **********************

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const sortOrder = selectElement.value;

    if (sortOrder === 'asc') {
      this.getAllTable(this.currentPage, this.pagesize);
    } else {
        this.getAllTableDESC(this.currentPage, this.pagesize);
    }
}

  getAllTable(page: number, size: number) {
    this.tableserive.getAlltable(page, size).subscribe(data => {
      console.log(data.result)
      this.listTable = data.result.content
      this.totalPages = data.result.totalPages
      this.pages = Array(this.totalPages).fill(0).map((x, i) => i)
    }, error => {
      console.log("Error list table: ", error)
    })
  }


  getAllTableDESC(page: number, size: number) {
    this.tableserive.getAlltableDESC(page, size).subscribe(data => {
      console.log(data.result)
      this.listTable = data.result.content
      this.totalPages = data.result.totalPages
      this.pages = Array(this.totalPages).fill(0).map((x, i) => i)
    }, error => {
      console.log("Error list table: ", error)
    })
  }


  getAllQr(){
    this.qrcodeservice.getAllQr().subscribe(data => { 
      console.log('olll',data.result)
      this.listTableContaiQR = data.result
    }, error => {
      console.log("Error list table: ", error)
    })
  }
  createNewTable() {
    this.tableserive.createTable(this.tableData).subscribe(data => {
      this.ngOnInit()
      this.openTotast('Tạo mới bàn thành công!')
    }, error => {
      console.log(error)
      this.openTotast('Lỗi tạo bàn ! ')
    })
  }

  getTablesFromFilter() {
    this.tableserive.getTablesFromFilter(this.tableData.nameTable, this.status, this.currentPage, this.pagesize)
      .subscribe(data => {
        console.log('data: ' + data.result)
        this.listTable = data.result.content;  // Lấy danh sách tables từ API
        this.totalPages = data.result.totalPages;  // Tổng số phần tử
      }, err => {
        console.log('error: ' + err)
      });
  }

  updateTable(keyTable: number) {
      this.tableserive.updateTable(this.tableData, keyTable).subscribe(
        data => {
            this.ngOnInit();
            this.openTotast('Cập nhật bàn thành công!');
        }, 
        error => {
          console.log("Error update table: ", error);
          this.openTotast('Lỗi cập nhật bàn! ');
        }
      );
  }
  

  deleteTable(idTable: number) {
    this.tableserive.deleteTable(idTable).subscribe(data => {
      this.ngOnInit()
      console.log("Delete success!", data);
      this.openTotast('Đã xóa bàn '+data.result.nameTable+' thành công!')
    }, err => {
      console.log("Delete fail!");
      this.openTotast('Xóa bàn thất bại!')
    })
  }

  lockedTable(idTable: number){
    this.tableserive.lockedTable(idTable).subscribe(data => {
      this.ngOnInit()
      this.openTotast('Đã khóa bàn '+data.result.nameTable)
    }, err => {
      console.log(err)
      this.openTotast('Khóa bàn thất bại!')
    })
  }

  // Hàm thay đổi trang khi người dùng click vào một trang mới
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      
      // Gọi phương thức lấy dữ liệu với thứ tự sắp xếp hiện tại
      if (this.sortOrder === 'asc') {
          this.getAllTable(this.currentPage, this.pagesize);
      } else {
          this.getAllTableDESC(this.currentPage, this.pagesize);
      }
  }
  }


  
  openModal(idtable: number) {
    this.tableserive.getTable(idtable).subscribe(data => {
      console.log(data.result);
      this.itemTable = data.result
      this.tableData = data.result
      this.keyTable = idtable
    })
  }


  resetForm() {
    this.tableData.nameTable = ''
  }


  // QRCODE***********************


  updateQrCode(idtable: number){
    this.qrcodeservice.updateQrCode(idtable).subscribe(
      data => {
        console.log('QR Code updated:', data);
        this.openTotast('Cập nhật QRCode thành công!')
      }, error => {
        console.error('Error creating QR Code:', error);
        this.openTotast('Cập nhật QRCode thất bại!')
      }
    );
  }

  createQrcode(idTable: number) {
    this.qrcodeservice.createQrCode(idTable).subscribe(
      data => {
        console.log('QR Code created:', data);
        this.openTotast('Tạo mới QRCode thành công!')
      }, error => {
        if(error.status === 400) {
          console.error('Error creating QR Code:', error);
          this.openTotast('Tạo mới QRCode thất bại!')
        }
      }
    );
  }

  
  printQrcode(){
    this.openTotast('Tiến hành in...');
  }


  // ****************
  ngOnInit(): void {
    this.getAllTable(this.currentPage, this.pagesize);
  }

  openTotast(status: string) {
    this.snackBar.open
      (status, "Đóng", {
        duration: 4000,
        horizontalPosition: 'end', //  'start', 'end'
        verticalPosition: 'bottom', //  'bottom'
      })
  }
}
