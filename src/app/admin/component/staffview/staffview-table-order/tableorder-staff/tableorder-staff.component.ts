import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../../../service/tableService/table.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tableResponse } from '../../../../../entity/response/table-response';
import { error } from 'console';
import { tableStatusResponse } from '../../../../../entity/response/tableStatus-response';
import { ShiftType } from '../../../../../entity/Shift/shift-type';
import { ShiftRequest } from '../../../../../entity/request/shift-request';
import { ShiftServiceService } from '../../../../../service/shiftservice/shift-service.service';
import { ApiRespone } from '../../../../../entity/api-respone';
import { ToastServiceService } from '../../../../../service/toastService/toast-service.service';
import { ShiftHandoverRequest } from '../../../../../entity/request/shift-handover-request';
import { ShiftHandOverServiceService } from '../../../../../service/shifthandoverservice/shift-hand-over-service.service';
import { ShiftRespone } from '../../../../../entity/response/shift-respone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tableorder-staff',
  templateUrl: './tableorder-staff.component.html',
  styleUrl: './tableorder-staff.component.css'
})
export class TableorderStaffComponent implements OnInit {

  constructor(private tableservice: TableService, private snackBar: MatSnackBar, private shiftService: ShiftServiceService
    , private toastService: ToastServiceService
    , private shiftHandOverService: ShiftHandOverServiceService
    , private router: Router
  ) { }
  idShift!: number;
  shiftType: ShiftType = new ShiftType(0, '', '', '');
  showToast: boolean = false;
  showToastShiftStart: boolean = true;
  shiftName: String = '';
  currentDate: Date = new Date;
  listTable!: tableResponse[]
  listStatuses!: tableStatusResponse[]
  denominations: number[] = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];
  cashList: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  totalCash: number = 0;
  shiftRespone!: ShiftRespone | null
  idLastShift!: number;
  idShiftEntity: number = 0
  toastOverLay: boolean =false;



  getAllTables() {
    this.tableservice.getAllTablesNotDeleted().subscribe(data => {
      console.log("Data", data);
      this.listTable = data.result
    }, error => {
      console.log("Error", error);
    })
  }
  
  toastOverLay1:boolean = false;
  updateShiftHandOver() {

      this.getShift(this.isEnding, this.getSIdhiftType());
      this.submitSuccess = true;
      
      this.submitMessage = "Thành công"
      this.addtionalCost1 = this.addtionalCost + this.addtionalCost1;
      this.addtionalCost2 = this.addtionalCost + this.addtionalCost2
      this.toastOverLay1 = true

  }
  closeToastMessage(){
    this.toastOverLay = false
    this.submitSuccess = false
  }

  getAllStatuses() {
    this.tableservice.getAllStatuses().subscribe(data => {
      console.log("Data", data)
      this.listStatuses = data.result
    }, error => {
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



  showToastWithTimeout(timeout: number) {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
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



  getFormattedTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  getShiftName(): String {
    const shift = this.shiftType.getShiftType(this.getFormattedTime(this.currentDate));
    if (shift == null) {
      return '';
    }
    this.shiftName = shift.nameShift
    this.shiftType.idShift = shift.idShift
    return shift.nameShift;
  }

  calculateTotal() {
    this.totalCash = 0;
    for (let index = 0; index < 10; index++) {
      this.totalCash += this.cashList[index] * this.denominations[index];

    }
    console.log(this.totalCash)

  }

  createShift() {

  }

  getSIdhiftType(): number {
    const shift = this.shiftType.getShiftType(this.getFormattedTime(this.currentDate));
    if (shift == null) {
      console.log(shift)
      return 0;
    } else {
      return shift.idShift;
    }

  }



  closeToastEnd() {
    localStorage.setItem('showToastShiftStart', 'true');
    this.toastService.setToastStateEnd(false);
    // this.toastService.setOverlay(false)
  }

  shiftReq: ShiftRequest = new ShiftRequest('', 0, '', 0, true);
  submitMessage: string = '';
  submitSuccess: boolean = false;
  status: String = 'Tạm dừng';
  isEnding: boolean = true;
  apirespone!: ApiRespone;
  cashStart2: number = 0;


  userName: String = 'Nhật Long'

  onSubmit() {
    this.shiftReq.idUser = '31000000-0000-0000-0000-000000000000'
    this.shiftReq.isWorkIng = true
    this.shiftReq.cashStart = this.totalCash
    this.shiftReq.idShiftType = this.getSIdhiftType()
    console.log(this.shiftReq.idShiftType)
    this.submitMessage = 'Số tiền đầu ca: ' + this.totalCash;
    this.showToastShiftStart = false;
    localStorage.setItem('showToastShiftStart', 'false');
    this.toastOverLay = false
    // set trong form kết ca
    this.cashStart2 = + this.shiftReq.cashStart
    this.isEnding = false;
    console.log(this.shiftReq)
    this.shiftService.createShift(this.shiftReq).subscribe(
      data => {
        this.apirespone = data.result;
        this.idShiftEntity = data.result.idShift
        console.log('API: ', data);
      },
      error => {
        console.error(error);

      }
    );
    this.submitMessage = 'Tạo ca thành công !';
    
    
  }

  showToastShiftEnd: boolean = false
  addtionalCost: number = 0;
  addtionalCost1: number = 0;
  addtionalCost2: number = 0;
  bankAmountShift: number = 0;
  bankAmountAll: number = 0;
  CashAmountShift: number = 0;
  CashAmountAll: number = 0;
  shiftHandOverReq: ShiftHandoverRequest = new ShiftHandoverRequest('', null, true, 0, 0, 0);

  getShift(isEnding: boolean, idShiftType: number) {
    this.shiftService.findShift(this.isEnding, idShiftType).subscribe(
      data => {
        this.shiftRespone = data.result
        this.idShiftEntity = data.result.idShift;
        this.idShift = data.result.idShift;

      },
      error => {
        this.shiftRespone = null


      }
    )

  }

  endSubmit() {
    this.shiftHandOverReq.idUser = '31000000-0000-0000-0000-000000000000';
    this.shiftHandOverReq.listOrder = null;
    this.shiftHandOverReq.isWorking = false;
    this.shiftHandOverReq.bankAmount = this.bankAmountShift;
    this.shiftHandOverReq.cashAmount = this.CashAmountShift;
    this.shiftHandOverReq.addtionalCost = 0
    // this.addtionalCost;
    console.log(this.shiftHandOverReq)
    try {
      this.shiftHandOverService.CreateHandOver(this.idShiftEntity, this.shiftHandOverReq).subscribe(
        data => {
          this.shiftHandOverReq = data.result
          console.log('Kết ca thành công! Vui lòng đăng nhập lại để tạo ca mới')

        },
        error => { console.log(error) }
      )
      this.toastOverLay=true
      this.submitMessage = 'Kết ca thành công! Vui lòng đăng nhập lại để tạo ca mới'
      this.submitSuccess = true;

      this.isEnding = true;
      this.totalCash = 0;
      this.addtionalCost = 0;
      this.idLastShift = this.getSIdhiftType();
      localStorage.setItem('showToastShiftStart', 'true');
      this.toastService.setToastStateEnd(false);
      // this.router.navigate(['/admin/staff/login']);
      this.shiftRespone = null;
    } catch (error) {
      this.submitMessage = 'Kết ca thất bại'
      this.submitSuccess = false
      return;
    }
    this.status = 'Tạm dừng';
    return;



  }



  showOverlay: boolean = true;

  ngOnInit(): void {
    const toastState = localStorage.getItem('showToastShiftStart');
    console.log(toastState)
    if (toastState === 'true' || toastState == null) {
      this.showToastShiftStart = true;
      this.toastOverLay = true;
      console.log(this.toastOverLay)
    } else {
      this.showToastShiftStart = false;
    }



    // this.getShift(this.isEnding,this.shiftType.idShift)

    this.getShiftName()
    this.getAllTables()
    this.getAllStatuses()
    this.toastService.showToastShiftEnd$.subscribe((state) => {
      this.showToastShiftEnd = state;

    });
  }
}
