
import { Component, OnInit } from '@angular/core';
import { Voucher } from '../../../../interface/voucher/voucher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VourcherService } from '../../../../service/voucherService/vourcher.service';
import { voucherRequest } from '../../../../entity/request/voucher-request';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-managerview-voucher',
  templateUrl: './managerview-voucher.component.html',
  styleUrl: './managerview-voucher.component.css'
})

export class ManagerviewVoucherComponent implements OnInit {
  vouchers: Voucher[] = [];
  filteredVouchers: Voucher[] = [];
  voucherForm: FormGroup;
  showModal = false;
  editMode = false;
  selectedStatus = '';
  searchText = "";
  sortField = "name";
  sortAscending = true;
  currentVoucherId: number | null = null;
  voucherRequest!: voucherRequest[]
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
        startDate: [null, Validators.required],
        endDate: [null, Validators.required,],
        description: [""]
      }
      , {
        validators: this.dateRangeValidator
      },
     
    );
    }
    dateRangeValidator = (formGroup: FormGroup) => {
      const { startDate, endDate } = formGroup.value;
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return { dateRange: 'Invalid date format' }; 
      }
      const today = new Date();
      return (
        startDateObj >= today &&
        startDateObj <= endDateObj
      ) ? null : { dateRange: 'End date must be after start date' };
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

    editVoucher(voucher: Voucher) {
      this.editMode = true;
      this.currentVoucherId = voucher.idPromotion;
      console.log(this.currentVoucherId);
      this.voucherForm.patchValue({
        namePromotion: voucher.namePromotion,
        discount: voucher.discount,
        startDate: this.formatDate(voucher.startDate),
        endDate: this.formatDate(voucher.endDate),
        description: voucher.description
      });

      this.showModal = true;
    }

    formatDate(date: Date): string {
      return new Date(date).toISOString().split('T')[0];
    }

    deleteVoucher(id: number) {
      const index = this.filteredVouchers.findIndex((item : Voucher)=>item.idPromotion===id);
      
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
        const newVoucherRequest: voucherRequest = { 
          namePromotion: formValue.namePromotion,
          discount: formValue.discount,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          description: formValue.description || '', 
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
              this.filteredVouchers=data.result;
              this.theTotalElements = data.result.totalElements;            
              this.totalPages = data.result.totalPages; 
              this.filterPromotion();

                this.closeModal();
                this.openTotast('Tạo mới thành công !')
              },
            error => {
              this.openTotast('Không thể thêm! (Voucher đã tồn tại)')
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

  hasError(field: string): boolean {
    const control = this.voucherForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
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
