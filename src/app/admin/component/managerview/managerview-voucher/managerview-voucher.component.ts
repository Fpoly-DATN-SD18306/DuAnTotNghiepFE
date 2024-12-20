
import { Component, OnInit } from '@angular/core';
import { Promotion } from '../../../../interface/voucher/promotion';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VourcherService } from '../../../../service/voucherService/vourcher.service';
import { promotionRequest } from '../../../../entity/request/promotion-request';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-managerview-voucher',
  templateUrl: './managerview-voucher.component.html',
  styleUrl: './managerview-voucher.component.css'
})

export class ManagerviewVoucherComponent implements OnInit {
  vouchers: Promotion[] = [];
  filteredVouchers: Promotion[] = [];
  voucherForm: FormGroup;
  showModal = false;
  editMode = false;
  selectedStatus = '';
  searchText = "";
  sortField = "name";
  sortAscending = true;
  currentVoucherId: number | null = null;
  voucherRequest!: promotionRequest[]
  number = 0;
  totalPages = 0;
  theTotalElements: number = 0;
  size: number = 10;
    constructor(private fb: FormBuilder, private voucherService  : VourcherService, private snackBar: MatSnackBar) {
      this.voucherForm = this.createForm();
      
    }
  
    createForm(): FormGroup {
      return this.fb.group({
        namePromotion: ['', Validators.required],
        discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        startDate: ['', Validators.required,],
        endDate: ['', Validators.required,],
        description: [""]
      }
      , {validator:this.dateRangeValidator}
     
     
    );
    }

    hasError(field: string): boolean {
      const control = this.voucherForm.get(field);
      return !!control && control.invalid && (control.dirty || control.touched); 
    }
    startDateChange() {
      const startDate = this.voucherForm.get('startDate')?.value;
      const endDate = this.voucherForm.get('endDate')?.value;
     
    const today = new Date();
    const startDateOnly = new Date(startDate).setHours(0,0,0,0);
    const todayOnly = today.setHours(0,0,0,0);
      if (startDateOnly < todayOnly) {
        this.openTotast('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hôm nay!');
      }
    }
    
    endDateChange() {
      const startDate = this.voucherForm.get('startDate')?.value;
      const endDate = this.voucherForm.get('endDate')?.value;
      
      if (endDate < startDate) {
        this.openTotast('Ngày kết thúc phải sau ngày bắt đầu!');
      }
    }
  dateRangeValidator = (formGroup: FormGroup): ValidationErrors | null => {
    const { startDate, endDate } = formGroup.value;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return { dateRange: true };
    }

    const today = new Date();
    const startDateOnly = new Date(startDateObj.setHours(0,0,0,0));
    const todayOnly = new Date(today.setHours(0,0,0,0));
  
    if (startDateOnly < todayOnly) {
      
      return { dateRange:true };
    }
    if (startDateObj >= endDateObj) {
      return { dateRange:true };
    }
    return  null ;
  };

    openModal() {
      this.showModal = true;
      this.editMode = false;
      this.voucherForm.reset();
    }
    closeModal() {
      this.showModal = false;
      this.voucherForm.reset();
    }

    editVoucher(promotion: Promotion) {
      this.editMode = true;
      this.currentVoucherId = promotion.idPromotion;
      console.log(this.currentVoucherId);
      this.voucherForm.patchValue({
        namePromotion: promotion.namePromotion,
        discount: promotion.discount,
        startDate: this.formatDate(promotion.startDate),
        endDate: this.formatDate(promotion.endDate),
        description: promotion.description
      });

      this.showModal = true;
    }

    formatDate(date: Date): string {
      return new Date(date).toISOString().split('T')[0];
    }

    deleteVoucher(id: number) {

      const index = this.filteredVouchers.findIndex((item : Promotion)=>item.idPromotion===id);
    
      if (confirm("Bạn muốn xóa voucher này?")) {
       
        if (index!==-1) {
          this.voucherService.deleteVoucher(id).subscribe(data => {
            this.filterPromotion();
            this.filteredVouchers=data.result.content
            this.theTotalElements = data.result.totalElements;            
            this.totalPages = data.result.totalPages;  
            this.closeModal();
            this.openTotast('Xóa thành công !')
          },
          error => {
            console.log('Error fetching data:', error);
          });
        }
      }
    }

    submitForm() {
      if (this.voucherForm.valid) {
        const formValue = this.voucherForm.value;
        const newVoucherRequest: promotionRequest = { 
          namePromotion: formValue.namePromotion,
          discount: formValue.discount,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          description: formValue.description || '', 
          isDeleted:false
        };
    
        if (this.editMode && this.currentVoucherId) {

          this.voucherService.putVoucher(newVoucherRequest, this.currentVoucherId).subscribe(data => {
              this.filteredVouchers=data.result.content
              this.theTotalElements = data.result.totalElements;            
              this.totalPages = data.result.totalPages;  
              this.ngOnInit();

              this.closeModal();
              this.openTotast('Cập nhật thành công !')
            });
        } else {
   
          this.voucherService.postVoucher(newVoucherRequest).subscribe(
            data => {
              this.filteredVouchers=data.result.conntent;
              this.theTotalElements = data.result.totalElements;            
              this.totalPages = data.result.totalPages; 
              this.filterPromotion();

                this.closeModal();
                this.openTotast('Tạo mới thành công !')
              },
              
            error => {
              this.openTotast('Promotion đã tồn tại hoặc bị khóa!')
              console.log('Error fetching data:', error);
            });
        }
      }
    }
    filterPromotion() {
     
      this.voucherService.filterVoucher(this.searchText,this.selectedStatus,  this.number, this.size).subscribe(
        data => {
          this.filteredVouchers = data.result.content;         
          this.theTotalElements = data.result.totalElements;            
          this.totalPages = data.result.totalPages;  
          this.vouchers = this.filteredVouchers; 
       
        },
        error => {
          console.log('Error fetching data:', error);
        }
      );
      
    }
    filterVouchers() {

      this.filteredVouchers = this.vouchers
      
      .filter(v => v.namePromotion.toLowerCase().includes(this.searchText.toLowerCase()));
      
   this.sortVouchers();
      
      }

    sortVouchers() {
      this.filteredVouchers.sort((a, b) => {
        if (this.sortField === "startDate" || this.sortField === "endDate") {
          const dateA = new Date(a[this.sortField] ?? '1970-01-01'); 
          const dateB = new Date(b[this.sortField] ?? '1970-01-01');
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; 
          }
          return this.sortAscending
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        } else {
          const valueA = this.sortField === "name" ? a.namePromotion : a.discount;
          const valueB = this.sortField === "name" ? b.namePromotion : b.discount;
          return this.sortAscending
            ? valueA > valueB ? 1 : -1
            : valueA < valueB ? 1 : -1;
        }
      });
    }
    ngOnInit() {
      this.filterPromotion();
      this.paging(this.number);
    }
  toggleSortOrder() {
    this.sortAscending = !this.sortAscending;
    this.sortVouchers();
  }


  // hasError(controlName: string, errorType?: string): boolean {
  //   if (errorType) {
  //       const control = this.voucherForm.get(controlName);
  //       return !!control && control.hasError(errorType);
  //   } else {
  //       return false;
  //   }
// }
  paging(numberPage: number) {

    if (numberPage >= 0 && numberPage < this.totalPages) {
      this.number = numberPage;
      this.filterPromotion(); 
    }
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
