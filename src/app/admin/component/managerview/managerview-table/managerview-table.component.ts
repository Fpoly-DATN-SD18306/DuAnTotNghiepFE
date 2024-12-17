import { Component, OnInit, SimpleChanges } from '@angular/core';
import { TableService } from '../../../../service/tableService/table.service';
import { Router } from '@angular/router';
import { tableResponse } from '../../../../entity/response/table-response';
import { QrcodeService } from '../../../../service/qrCodeService/qrcode.service';
import { qrCodeResponse } from '../../../../entity/response/qrcode-response';
import { error, table } from 'console';
import { ApiRespone } from '../../../../entity/api-respone';
import { FormGroup } from '@angular/forms';
import { tabelRequest } from '../../../../entity/request/table-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { qrCodeRequest } from '../../../../entity/request/qrcode-request';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaService } from '../../../../service/areaService/area.service';
import { AreaResponse } from '../../../../entity/response/area-response';
import { AreaRequest } from '../../../../entity/request/area-request';

@Component({
  selector: 'app-managerview-table',
  templateUrl: './managerview-table.component.html',
  styleUrl: './managerview-table.component.css'
})
export class ManagerviewTableComponent implements OnInit {

  //Area
  listAreas!: AreaResponse[]
  keyArea: number = 1
  selectedArea!: number
  areaData: AreaRequest = {
    nameArea : ''
  }

  //Table 
  listTableContaiQR! : tableResponse[]
  itemTable?: tableResponse
  listTable!: tableResponse[]
  keyTable!: number;
  currentPage: number = 0
  pagesize: number = 17
  totalPages: number = 0
  pages: number[] = []
  sortOrder: string = 'asc';
  timestamp: string = new Date().getTime().toString();

//*** */
  status : string = ''
  nameTableSearch: string = ''

  tableData: tabelRequest = {
    nameTable: '',
    locked: false,
    idArea : 0
  }

  loader =false;

  constructor(
    private tableserive: TableService, 
    private qrcodeservice: QrcodeService, 
    private areaService: AreaService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.timestamp = new Date().getTime().toString();
   }

  // AREA******************
   createArea(){
    this.loader=true;
    this.areaService.createArea(this.areaData).subscribe(data => {
      this.getAllAreas()
      this.openTotast('✅ Tạo mới khu vực thành công!')
      this.areaData.nameArea = ''
      this.loader=false;
    },error => {
      this.openTotast('❌ Tạo mới thất bại!')
      this.loader=false;
    })
   }

  getAllAreas(){
    this.areaService.getAllAreas().subscribe(data =>{
      this.listAreas = data.result
    },error => {
    })
  }


  updateArea(keyArea: number) {
    this.loader=true;
    this.areaService.updateArea(this.areaData, keyArea).subscribe(
      data => {
        this.ngOnInit()
        this.openTotast('✅ Cập nhật khu vực thành công!');
        this.loader=true;
      }, 
      error => {
        this.openTotast('❌ Lỗi cập nhật! ');
        this.loader=true;
      }
    );
}

  deleteArea(keyArea : number){
    this.areaService.deleteArea(this.keyArea).subscribe(data => {
      this.getAllAreas()
      this.openTotast('✅ Xóa khu vực thành công!')
    },err =>{
      this.openTotast('❌ Xóa thất bại!')
    })
  }
  

  openModalArea(idArea: number) {
    this.areaService.getArea(idArea).subscribe(data => {
      this.areaData = data.result
      this.keyArea = idArea
    },error =>{
    })
  }

  // TABLE **********************

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const sortOrder = selectElement.value;

    if (sortOrder === 'asc') {
      this.getAllTableASC(this.currentPage, this.pagesize, this.keyArea);
    } else {
        this.getAllTableDESC(this.currentPage, this.pagesize, this.keyArea);
    }
}

  getAllTableASC(page: number, size: number, idArea: number) {
    this.tableserive.getAllTablesASC(page, size, idArea).subscribe(data => {
      this.listTable = data.result.content
      this.totalPages = data.result.totalPages
      this.pages = Array(this.totalPages).fill(0).map((x, i) => i)
    }, error => {
    })
  }


  getAllTableDESC(page: number, size: number, idArea: number) {
    this.tableserive.getAlltableDESC(page, size, idArea).subscribe(data => {
      this.listTable = data.result.content
      this.totalPages = data.result.totalPages
      this.pages = Array(this.totalPages).fill(0).map((x, i) => i)
    }, error => {
    })
  }

  getTablesFromFilter(keyArea : number) {
    this.tableserive.getTablesByArea(this.nameTableSearch, keyArea, this.status, this.currentPage, this.pagesize)
      .subscribe(data => {
        this.listTable = data.result.content;  // Lấy danh sách tables từ API
        this.totalPages = data.result.totalPages;  // Tổng số phần tử
        this.keyArea = keyArea
      }, err => {
      });
  }


  getAllQr(){
    this.qrcodeservice.getAllQr().subscribe(data => { 
      this.listTableContaiQR = data.result
    }, error => {
    })
  }
  createNewTable() {
    this.loader=true;
    this.tableserive.createTable(this.tableData).subscribe(data => {
      this.ngOnInit()
      this.openTotast('✅ Tạo mới bàn thành công!')
      this.loader=false;
    }, error => {
      this.openTotast('❌ Lỗi tạo bàn ! ')
      this.loader=false;
    })
  }

 

  updateTable(keyTable: number) {
      this.tableserive.updateTable(this.tableData, keyTable).subscribe(
        data => {
          this.ngOnInit()
            this.openTotast('✅ Cập nhật bàn thành công!');
        }, 
        error => {
          this.openTotast('❌ Lỗi cập nhật bàn! ');
        }
      );
  }
  

  deleteTable(keyTable: number) {
    this.tableserive.deleteTable(keyTable).subscribe(data => {
      this.ngOnInit()
      this.openTotast('✅ Đã xóa bàn thành công!')
      this.keyTable = 0
    }, err => {
      this.openTotast('❌ Xóa bàn thất bại!')
    })
  }

  lockedTable(idTable: number){
    this.tableserive.lockedTable(idTable).subscribe(data => {
      this.ngOnInit()
      this.openTotast('⚠️ Đã khóa bàn '+data.result.nameTable)
    }, err => {
      this.openTotast('❌ Khóa bàn thất bại!')
    })
  }

  // Hàm thay đổi trang khi người dùng click vào một trang mới
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      
      // Gọi phương thức lấy dữ liệu với thứ tự sắp xếp hiện tại
      if (this.sortOrder === 'asc') {
          this.getAllTableASC(this.currentPage, this.pagesize, this.keyArea);
      } else {
          this.getAllTableDESC(this.currentPage, this.pagesize, this.keyArea);
      }
  }
  }


  
  openModal(idtable: number) {
    this.tableserive.getTable(idtable).subscribe(data => {
      this.itemTable = data.result
      this.tableData = data.result
      this.keyTable = idtable
    })
  }


  resetForm() {
    this.tableData.nameTable = ''
  }


  // QRCODE***********************
  refreshImg(){
    this.timestamp = new Date().getTime().toString();
  }
  updateQrCode(idtable: number){
    this.loader=true;
    
    this.qrcodeservice.updateQrCode(idtable).subscribe(
      data => {
        this.openTotast('✅ Cập nhật QRCode thành công!')
        // setTimeout(()=>{
        //   this.timestamp = new Date().getTime().toString();
        // },3000)
        this.loader=false;
        
      }, error => {
        console.error('Error creating QR Code:', error);
        this.openTotast('❌ Cập nhật QRCode thất bại!')
        this.loader=false;
      }
    );
  }

  createQrcode(idTable: number) {
    this.loader=true;
    this.qrcodeservice.createQrCode(idTable).subscribe(
      data => {
        this.openTotast('✅ Tạo mới QRCode thành công!')
        this.loader=false;
      }, error => {
        if(error.status === 400) {
          console.error('Error creating QR Code:', error);
          this.openTotast('❌ Tạo mới QRCode thất bại!')
        }
        this.loader=false;
      }
    );
  }

  
  printQrcode(){
    this.openTotast('ℹ️ Tiến hành in...');
  }




  // ****************
  ngOnInit(): void {
    this.getTablesFromFilter(this.keyArea);
    this.getAllAreas()
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
