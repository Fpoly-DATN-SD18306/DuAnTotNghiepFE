import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../../service/table.service';
import { Router } from '@angular/router';
import { tableResponse } from '../../../../entity/response/table-response';
import { QrcodeService } from '../../../../service/qrcode.service';
import { qrCodeResponse } from '../../../../entity/response/qrcode-response';
import { error } from 'console';
import { ApiRespone } from '../../../../entity/api-respone';
import { FormGroup } from '@angular/forms';
import { tabelRequest } from '../../../../entity/request/table-request';

@Component({
  selector: 'app-managerview-table',
  templateUrl: './managerview-table.component.html',
  styleUrl: './managerview-table.component.css'
})
export class ManagerviewTableComponent implements OnInit {
  
  itemqrcode! :qrCodeResponse
  listTable! :tableResponse[]
  keyTable?: number;
  currentPage : number = 0
  pagesize :number = 18
  totalPages : number = 0
  pages: number[] = []
  tableData : tabelRequest = {
    nameTable: '',
    isDeleted: false 
  }
  
  constructor(private tableserive : TableService, private qrcodeservice : QrcodeService, private router : Router){}
  
  
  getAllTable(page:number, size:number){
    this.tableserive.getAlltable(page, size).subscribe(data => {
      console.log(data.result)
      this.listTable = data.result.content
      this.totalPages = data.result.totalPages
      this.pages = Array(this.totalPages).fill(0).map((x, i) => i)
    },error => {
      console.log("Error list table: ", error)
    })
  }

  createNewTable(){
    this.tableserive.createTable(this.tableData).subscribe(data => {
      this.ngOnInit()
      console.log("create success!")
    }, error => {
      console.log("Error create table: ", error);
    })
  }



  updateTable(keyTable?: number) {
    if (keyTable !== undefined) {
      this.tableserive.updateTable(this.tableData, keyTable).subscribe(data => {
        this.getAllTable(this.currentPage, this.pagesize);  
        this.keyTable = 0
      }, error => {
        console.log("Error update table: ", error);
      });
    } else {
      console.log("Error: keyTable is undefined. Cannot update table.");
    }
  }
  

  deleteTable(idTable : number){
    this.tableserive.deleteTable(idTable).subscribe(data => {
      console.log("Delete success!");
      alert('Delete success')
    }, err => {
      console.log("Delete fail!");
    })
  }




  // QRCODE***********************
  getQrCode(idtable: number){  
    this.qrcodeservice.getQrCode(idtable).subscribe(data => {
      console.log(data.result)
      this.itemqrcode = data.result
      
    }, error => {
      console.log('Error qrcode : ', error);   
    })  
}

createQrcode(idTable: number) {
  this.qrcodeservice.createQrCode(idTable).subscribe(
    data => {
      console.log('QR Code created:', data);
    },error => {
      console.error('Error creating QR Code:', error);
    }
  );
}

  openModal(idtable:number){
    this.tableserive.getTable(idtable).subscribe(data => {
      console.log('table', data.result);
      this.tableData = data.result
      this.keyTable = data.result.idTable
      this.getQrCode(idtable)
    })
  }


  resetForm() {
    this.tableData.nameTable = ''
  }
  
  ngOnInit(): void {
    this.getAllTable(this.currentPage, this.pagesize);  
  }
}
