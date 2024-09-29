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

@Component({
  selector: 'app-managerview-table',
  templateUrl: './managerview-table.component.html',
  styleUrl: './managerview-table.component.css'
})
export class ManagerviewTableComponent implements OnInit {

  listQrcode!: qrCodeResponse[]
  itemqrcode!: qrCodeResponse
  listTable!: tableResponse[]
  keyTable?: number;
  currentPage: number = 0
  pagesize: number = 17
  totalPages: number = 0
  pages: number[] = []

  tableData: tabelRequest = {
    nameTable: '',
    deleted: true
  }

  constructor(private tableserive: TableService, private qrcodeservice: QrcodeService, private router: Router,
    private snackBar: MatSnackBar
  ) { }

  // TABLE **********************
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

  createNewTable() {
    this.tableserive.createTable(this.tableData).subscribe(data => {
      this.ngOnInit()
      this.openTotast('Tạo mới bàn thành công!')
    }, error => {
      this.openTotast('Tạo mới bàn thất bại!')
    })
  }


  updateTable(keyTable?: number) {
    if (keyTable !== undefined) {
      this.tableserive.updateTable(this.tableData, keyTable).subscribe(
        data => {
          if (data.message.includes('thành công')) {
            this.ngOnInit();
            this.openTotast('Cập nhật bàn thành công!');
          } else {
            this.openTotast('Lỗi: ' + data.message);
          }
        }, 
        error => {
          console.log("Error update table: ", error);
          this.openTotast('Cập nhật thất bại!');
        }
      );
    } else {
      this.openTotast('Cập nhật thất bại!');
    }
  }
  
  


  deleteTable(idTable: number) {
    this.tableserive.deleteTable(idTable).subscribe(data => {
      this.ngOnInit()
      console.log("Delete success!", data);
      this.openTotast('Đã khóa bàn '+data.result.nameTable)
    }, err => {
      console.log("Delete fail!");
      this.openTotast('Khóa bàn thất bại!')
    })
  }

  // Hàm thay đổi trang khi người dùng click vào một trang mới
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllTable(this.currentPage, this.pagesize);
    }
  }


  
  openModal(idtable: number) {
    this.tableserive.getTable(idtable).subscribe(data => {
      console.log(data.result);
      this.tableData = data.result
      this.keyTable = data.result.idTable
      this.getQrCode(idtable)
    })
  }


  resetForm() {
    this.tableData.nameTable = ''
  }


  // QRCODE***********************
  getQrCode(idtable: number) {
    this.qrcodeservice.getQrCode(idtable).subscribe(data => {
      console.log(data.result)
      this.itemqrcode = data.result
    }, error => {
      console.log('Error qrcode : ', error);
    })
  }

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

  getAllQrcode(){
    this.qrcodeservice.getAllQRcodes().subscribe(data => {
      this.listQrcode = data.result
      console.log('All qrcodes:', data.result)
    }, error =>{
      console.log("error getallqrcode: ",error)
    })
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
