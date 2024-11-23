import { Component } from '@angular/core';
import { ToastServiceService } from '../../../service/toastService/toast-service.service';

@Component({
  selector: 'app-adminview',
  templateUrl: './adminview.component.html',
  styleUrl: './adminview.component.css'
})
export class AdminviewComponent {
  constructor(private toastService: ToastServiceService) {}

  toastOverLay: boolean= false
  
  updateToastEnd() {
    this.toastService.setToastStateEnd(true);
    this.toastOverLay = true
  }

}
