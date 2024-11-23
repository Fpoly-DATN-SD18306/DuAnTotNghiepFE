import { Component, OnInit } from '@angular/core';
import { ShiftType } from '../../../../entity/Shift/shift-type';
import { ShiftRequest } from '../../../../entity/request/shift-request';
import { ShiftServiceService } from '../../../../service/shiftservice/shift-service.service';
import { ApiRespone } from '../../../../entity/api-respone';
import { OrderRespone } from '../../../../entity/response/order-respone';
import { ShiftRespone } from '../../../../entity/response/shift-respone';
import { ShiftHandOverServiceService } from '../../../../service/shifthandoverservice/shift-hand-over-service.service';
import { ShiftHandoverRequest } from '../../../../entity/request/shift-handover-request';
import { error } from 'console';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shift-info',
  templateUrl: './shift-info.component.html',
  styleUrl: './shift-info.component.css'
})
export class ShiftInfoComponent implements OnInit {
  idShift!: number;
  shiftType: ShiftType = new ShiftType(0, '', '', '');
  isEnding: boolean = true;
  shiftReq: ShiftRequest = new ShiftRequest('', 0, '', 0, true);
  shiftName: String = '';
  idUser: String = '';
  addtionalCost: number = 0;
  addtionalCost1: number = 0;
  addtionalCost2: number = 0;
  cashStart!: number;
  currentDate: Date = new Date;
  apirespone!: ApiRespone;
  listOrder!: OrderRespone[] | null;
  cashStart2: Number = 0;
  status: String = 'Tạm dừng';
  shiftRespone: ShiftRespone | null = null;
  shiftHandOverReq: ShiftHandoverRequest = new ShiftHandoverRequest('', null, true, 0, 0, 0);
  bankAmountShift: number = 0;
  bankAmountAll: number = 0;
  CashAmountShift: number = 0;
  CashAmountAll: number = 0;
  idShiftEntity: number = 0;
  isEndingShift: boolean = false;
  idLastShift!: number;
  constructor(private shiftService: ShiftServiceService, private shiftHandOverService: ShiftHandOverServiceService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getShiftName()
    if (this.isEnding == true) {
      return;
    } else {
      
    }
  }

  getShiftName(): String {
    const shift = this.shiftType.getShiftType(this.getFormattedTime(this.currentDate));
    if (shift == null) {
      return '';
    }
    this.shiftName = shift.nameShift

    return shift.nameShift;
  }

  getShiftId(): number {
    const shift = this.shiftType.getShiftType(this.getFormattedTime(this.currentDate));
    if (shift == null) {
      return 0;
    } else {
      if (shift.idShift == this.idLastShift) {
        return -1;
      } else {
        return shift.idShift;
      }
    }

  }



  getFormattedTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }


  submitMessage: string = '';
  submitSuccess: boolean = false;



  checkShift(): boolean {
    if (this.getShift(this.isEnding, this.getShiftId()) == null) {
      console.log(this.getShift(this.isEnding, this.getShiftId()))
      return false;
    } else {
      return false;
    }
  }


  onSubmit() {
    this.checkShift()
    console.log("có tồn tại: " + this.checkShift())
    this.validateForm()

    if(this.getShiftId() == -1){
      this.submitSuccess = false;
      this.submitMessage = 'Bạn đã kết ca '+ this.idLastShift+ ' vui lòng tạo lại ở ca sau';
      return;
    }


    if (this.shiftRespone == null) {
      if (this.cashStartError == true) {
        this.submitSuccess = false;
        this.submitMessage = 'Tạo ca thất bại!';
      } else {
        if (this.isEnding == true) {
          this.shiftReq.idUser = '31000000-0000-0000-0000-000000000000'
          this.shiftReq.isWorkIng = true
          this.shiftReq.cashStart = this.cashStart
          this.shiftReq.idShiftType = this.getShiftId()
          console.log(this.shiftReq.idShiftType)
          this.shiftReq.listOrder = null;
          this.submitSuccess = true;
          this.status = 'Đang phục vụ'
          // set trong form kết ca
          this.cashStart2 = + this.shiftReq.cashStart
          this.isEnding = false;
          console.log(this.shiftReq)
          this.shiftService.createShift(this.shiftReq).subscribe(
            data => {
              this.apirespone = data.result;
              console.log('API: ', data);
            },
            error => {
              console.error(error);

            }
          );
          this.submitMessage = 'Tạo ca thành công!';

        } else {
          this.submitSuccess = false;
          this.submitMessage = 'Vui lòng kết ca trước khi tạo!';
        }





      }
    } else {
      this.submitSuccess = false;
      this.submitMessage = 'Đã tạo ca' + this.shiftName + 'trong hôm nay vui long đợi ca tiếp theo!';
    }

  }


  cashStartError!: boolean;
  validateForm(): void {
    const inputElement = document.getElementById('cashStart1') as HTMLInputElement;
    const value = inputElement.value;

    const regex = /^[0-9]+$/;

    if (!value || !regex.test(value)) {
      this.cashStartError = true;
    } else {
      this.cashStartError = false;
    }
  }

  getShift(isEnding: boolean, idShiftType: number) {
    this.shiftService.findShift(!this.isEnding, idShiftType).subscribe(
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


  updateShift() {
    if (this.isEnding == true) {
      this.submitSuccess = false;
      this.submitMessage = 'Vui lòng tạo ca!';
    } else {
      this.getShift(this.isEnding, this.getShiftId());
      this.submitSuccess = true;
      this.submitMessage = 'Lưu thông tin thành công!';
      this.addtionalCost1 = this.addtionalCost + this.addtionalCost1;
      this.addtionalCost2 = this.addtionalCost + this.addtionalCost2
    }



  }

  checkCreate() {
    if (this.isEnding == true) {
      this.submitSuccess = false;
      this.submitMessage = 'Vui lòng tạo ca trước khi kết ca!';
    } else {
      return;
    }
  }



  endShift() {
    this.shiftHandOverReq.idUser = '31000000-0000-0000-0000-000000000000';
    this.shiftHandOverReq.listOrder = null;
    this.shiftHandOverReq.isWorking = false;
    this.shiftHandOverReq.bankAmount = this.bankAmountShift;
    this.shiftHandOverReq.cashAmount = this.CashAmountShift;
    this.shiftHandOverReq.addtionalCost = this.addtionalCost;
    this.isEndingShift = true;
    try {
      this.shiftHandOverService.CreateHandOver(this.idShiftEntity, this.shiftHandOverReq).subscribe(
        data => {
          this.shiftHandOverReq = data.result
          console.log(this.shiftHandOverReq)
        },
        error => { console.log(error) }
      )
      this.submitMessage = 'Kết ca thành công! Vui lòng đăng nhập lại để tạo ca mới'
      this.submitSuccess = true;
      this.status = 'Tạm dừng';
      this.isEnding = true;
      this.cashStart = 0;
      this.addtionalCost = 0;
      this.idLastShift = this.getShiftId();
      // this.router.navigate(['/admin/staff/ShiftInfo']);
      this.shiftRespone = null;
    } catch (error) {
      this.submitMessage = 'Kết ca thất bại'
      this.submitSuccess = false
      return;
    }
    return;

  }


}

