import { AreaService } from './../../../../../service/areaService/area.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableService } from '../../../../../service/tableService/table.service';
import { WebsocketService } from '../../../../../service/websocketService/websocket.service';
import { OrderdetailService } from '../../../../../service/orderdetailService/orderdetail.service';
import { OrderDetailResponse } from '../../../../../entity/response/orderdetail-response';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../../service/orderService/order.service';
import { OrderResponse } from '../../../../../entity/response/order-response';
import { Console, error } from 'console';
import { tableResponse } from '../../../../../entity/response/table-response';
import { FoodService } from '../../../../../service/foodService/food.service';
import { foodResponse } from '../../../../../entity/response/food-response';
import e from 'express';
import { CategoryService } from '../../../../../service/categoryService';
import { CategoryResponse } from '../../../../../entity/response/category-response';
import { PaymentService } from '../../../../../service/paymentService/Payment.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceService } from '../../../../../service/paymentService/Invoice.service';
import { invoiceRespone } from '../../../../../interface/invoice/invoice';
import { AreaResponse } from '../../../../../entity/response/area-response';
import { foodRequest } from '../../../../../entity/request/food-request';
import { OrderDetailRequest } from '../../../../../entity/request/orderdetail-request';

@Component({
  selector: 'app-orderprocessing',
  templateUrl: './orderprocessing.component.html',
  styleUrl: './orderprocessing.component.css'
})
export class OrderprocessingComponent implements OnInit {
  listOrderDetails: OrderDetailResponse[] = []
  listProducts: foodResponse[] = []
  listCategories: CategoryResponse[] = []
  itemTable?: tableResponse
  order?: OrderResponse

  activeCategoryId: number | null = null;

  listArea : AreaResponse[]=[];
  listTable :tableResponse[]=[];
  selectedAreaId: number=0;
  seletedListFood:OrderDetailRequest[]=[];
  listFoodRequest:foodRequest[]=[];
  quantity:number=0;
  constructor(private tableservice: TableService, private snackBar: MatSnackBar,
    private areaService :AreaService,
    private route: ActivatedRoute,
    private orderdetailsService: OrderdetailService,
    private orderService: OrderService,
    private productService: FoodService,
    private categoryService: CategoryService,
    private webSocketService: WebsocketService,
    private paymentService: PaymentService, private invoiceService: InvoiceService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.getData()
    this.getAllProducts()
    this.getAllCategories()
    // this.notificationOrder()
  }

  getOrder(idOrder: number) {
    this.orderService.getOrder(idOrder).subscribe(data => {
      console.log('Data order: wwww', data.result);
      this.order = data.result
    })
  }
  getAllArea(){
   this.areaService.getAllAreas().subscribe(data =>{
    this.listArea=data.result
   }, error => {
    console.log('Error', error)
  }
   )
  }

  getTable() {
    console.log("areaid",this.selectedAreaId)
    this.tableservice.getTablesByArea("", this.selectedAreaId, "", 0, 100000)
      .subscribe(data => {
        this.listTable = data.result.content;
        console.log("Table", this.listTable);
      });
  }
  

  updateQuantity(index: number, newQuantity: string) {
    this.listOrderDetails[index].quantity = this.listOrderDetails[index].quantity - parseInt(newQuantity);
    this.quantity = parseInt(newQuantity);
  }
  moveToNewTable(id: number) {
    const food = this.listOrderDetails.find(item => item.idFood === id);
  
    if (food) {
 
      const existingItem = this.seletedListFood.find(item => item.idFood === id);
  
      if (existingItem) {
     
        existingItem.quantity += this.quantity;
      } else {
   
        const orderRequest: OrderDetailRequest = {
          idFood: food.idFood,
          namefood: food.namefood,
          quantity: this.quantity,
          noteFood: food.noteFood,
          price: food.price,
          totalPrice: food.totalPrice,
          discount: food.discount
        };
        this.seletedListFood.push(orderRequest);
      }
    }
  }
  getData() {
    this.route.params.subscribe(param => {
      let idOrder = param['idOrder']
      let idTable = param['idTable']
      if (idOrder != undefined) {
        this.getOrder(idOrder)
        console.log('IDORDER: ', idOrder)
        this.orderdetailsService.getOrderDetail(idOrder, idTable).subscribe(data => {
          console.log('DataOrderget: ', data.result)
          this.listOrderDetails = data.result
        })
      } else {
        this.tableservice.getTable(idTable).subscribe(data => {
          this.itemTable = data.result
        })
      }
    })
  }

  confirmOrder(idOrder: number | null, idTable: number | null) {
    this.orderService.confirmOrder(idOrder, idTable).subscribe(data => {
      console.log('Order confirmed', data.result)
    }, error => {
      console.log('Error', error)
    })
  }


  // notificationOrder(){
  //   this.webSocketService.onMessage().subscribe(message => {
  //       if(message){
  //         this.ngOnInit()
  //       console.log('ordermess:'+message)
  //       }
  //   });
  // }

  // notificationPayment() {
  //   this.webSocketService.onPaymentMessage().subscribe(message => {
  //     if (message) {
  //       let obj = JSON.parse(message)
  //       console.log('alooooooooooooooooooo:' + message)
  //       this.speakText();
  //       this.ngOnInit()
  //       console.log('payment:' + message)
  //     }
  //   });
  // }
  // ********************************
  getAllProducts() {
    this.productService.getAllList().subscribe(data => {
      this.activeCategoryId = null;
      this.listProducts = data.result.content
      console.log('Data product', data.result.content)
    }, err => {
      console.log('Error', err)
    })
  }

  getAllCategories() {
    this.categoryService.getAllCate().subscribe(data => {
      console.log('Category: ', data.result)
      this.listCategories = data.result
    })
  }

  getByIdCategory(idCategory: number) {
    this.productService.getByIdCategory(idCategory).subscribe(data => {
      this.activeCategoryId = idCategory;
      this.listProducts = data.result
      console.log('data food by category', data.result)
    })
  }



  // Hàm để phát giọng nói
  speakText() {
    const textToSpeak = "Đã nhận được thanh toán của đơn hàng số ";
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Lấy danh sách giọng nói có sẵn
    const voices = speechSynthesis.getVoices();

    // Tìm giọng nói tiếng Việt
    const vietnameseVoice = voices.find(voice => voice.lang === 'vi-VN');

    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;  // Chọn giọng nói tiếng Việt
    } else {
      console.log('Giọng nói tiếng Việt không có sẵn, sử dụng giọng nói mặc định.');
    }

    // Phát giọng nói
    speechSynthesis.speak(utterance);

  }


  paymentPaythod = "cash"

  errorCode: Record<number, string> =
    { 1601: "Đơn hàng đã được hoàn thành trước đó !" }

  listDataInvoice  !: invoiceRespone[];


  formatPrice(price: number) {

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  paymentOrder() {
    if (this.paymentPaythod == "ewallet") {
      if (this.order) {
        this.paymentService.postRequestPaymentVNPay(this.order.idOrder).subscribe(
          data => {
            console.log(data);
            // window.location.assign(data.result.urlToRedirect)
            window.open(data.result.urlToRedirect)
          }, error => {
            alert(this.errorCode[error.error.code])
            console.log(error);

          }

        );
      }
    } else {
      if (this.order) {
        this.paymentService.postRequestPaymentManual(this.order.idOrder).subscribe(
          data => {
            console.log(data);
            // window.location.assign(data.result.urlToRedirect)
            this.router.navigateByUrl("/admin/staff/tableorder_staff/tableorder")
          }, error => {
            alert(this.errorCode[error.error.code])
            console.log(error);

          }

        );
      }
    }
  }

  getInvoice() {
    if (this.order)
      this.invoiceService.getInvoiceByIdOrder(this.order.idOrder).subscribe(
        data => {
          this.listDataInvoice = data.result
          console.log(this.listDataInvoice);
          console.log("alo");

        }, error => {
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
          pdfWindow.onload = function () {
            pdfWindow.print();
          };
        }

      });
    } else {
      console.error("Không tìm thấy div với ID 'body_invoice'");
    }
  }

}

