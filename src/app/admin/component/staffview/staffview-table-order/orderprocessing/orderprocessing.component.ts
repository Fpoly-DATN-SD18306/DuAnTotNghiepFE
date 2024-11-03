import { Component } from '@angular/core';
import { PaymentService } from '../../../../../service/paymentService/Payment.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceService } from '../../../../../service/paymentService/Invoice.service';
import { invoiceRespone } from '../../../../../interface/invoice/invoice';
import { error } from 'console';

@Component({
  selector: 'app-orderprocessing',
  templateUrl: './orderprocessing.component.html',
  styleUrl: './orderprocessing.component.css'
})
export class OrderprocessingComponent {

  constructor(private paymentService : PaymentService, private invoiceService : InvoiceService){}

  paymentPaythod = "vnpay"

  listDataInvoice  !: invoiceRespone[];


  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  paymentOrder(){
    this.paymentService.postRequestPaymentVNPay(16).subscribe(
      data =>{
        console.log(data);
        // window.location.assign(data.result.urlToRedirect)
        window.open(data.result.urlToRedirect)
      }, error =>{
        console.log(error);
        
      }
    );
  }

  getInvoice(){
    this.invoiceService.getInvoiceByIdOrder(16).subscribe(
      data=>{
        this.listDataInvoice = data.result
        console.log(this.listDataInvoice);
        console.log("alo");
        
      }, error  =>{
        console.log(error)
      }
    )
  }

 
  downloadPdf() {
    const data = document.getElementById('body_invoice');

    if (data) {
      html2canvas(data).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        // Tính toán kích thước PDF dựa trên kích thước hình ảnh
        const imgWidth = 200; 
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Thêm trang mới nếu cần thiết
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Lưu PDF và mở hộp thoại in
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Mở PDF trong tab mới
        const pdfWindow = window.open(pdfUrl);
        if (pdfWindow) {
          pdfWindow.onload = function() {
            pdfWindow.print(); 
          };
        }

      });
    } else {
      console.error("Không tìm thấy div với ID 'body_invoice'");
    }
  }
  

}
