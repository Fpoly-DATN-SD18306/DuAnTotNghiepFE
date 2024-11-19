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
import { OrderRequest } from '../../../../../entity/request/order-request';
import { RequestOrder } from '../../../../../service/requestOrder.service';

@Component({
  selector: 'app-orderprocessing',
  templateUrl: './orderprocessing.component.html',
  styleUrl: './orderprocessing.component.css'
})
export class OrderprocessingComponent implements OnInit {
  listOrderDetails: OrderDetailResponse[] = []
  listOrderDetailsTableMerge: OrderDetailResponse[] = []
  listProducts: foodResponse[] = []
  listCategories: CategoryResponse[] = []
  itemTable?: tableResponse
  selectedTable: tableResponse | null = null;
  order?: OrderResponse
  selectedTableId: number | null = null;
  mergerOrderId: number | null = null;
  activeCategoryId: number | null = null;

  listArea : AreaResponse[]=[];
  listTable :tableResponse[]=[];
  tableMergerId !:number;
  indexOrder !:number;
 
  selectedAreaId: number=0;
  seletedListFood:OrderRequest[]=[];
  seletedListUpdateFood:OrderRequest[]=[];
  seletedListMergerFood:OrderRequest[]=[];
  listFoodRequest:foodRequest[]=[];
  quantity:number=0;
  test!: any;
  constructor(private tableservice: TableService, private snackBar: MatSnackBar,
    private areaService :AreaService,
    private route: ActivatedRoute,
    private orderdetailsService: OrderdetailService,
    private orderService: OrderService,
    private requestOrder: RequestOrder,
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
    this.tableservice.getTablesByArea("", this.selectedAreaId, "AVAILABLE", 0, 100000)
      .subscribe(data => {
        this.listTable = data.result.content;
        console.log("Table", this.listTable);
      });
  }
  getTableOpen() {
    console.log("areaid",this.selectedAreaId)
    this.tableservice.getTablesByArea("", this.selectedAreaId, "PENDING", 0, 100000)
      .subscribe(data => {
        this.listTable = data.result.content;
        console.log("Table", this.listTable);
      });
  }

  updateQuantity(index: number,event:Event,id: number, ) {
    let target = event.currentTarget as HTMLInputElement
    if(target.valueAsNumber){
      this.quantity = target.valueAsNumber ;
    }else{
      this.quantity = 0
    }
    
    this.moveToNewTable(id,index)
    
  }
  
  moveToNewTable(id: number, index: number): void {
    
  
      const food = this.listOrderDetails.find(item => item.idFood === id);
    if (food) {

        if (this.quantity <= 0) {
            this.openTotast("Số lượng phải là số dương.");
            return;
        }

        if ( this.quantity>food.quantity ) {
            this.openTotast("Số lượng chuyển không được lớn hơn số lượng hiện có ở bàn cũ.");
            return;
        }
   
        const existingItem = this.seletedListFood.find(item => item.idFood === id);

       
        if (existingItem) {
          
            existingItem.quantity += this.quantity;
        } else {
           
              const orderRequest: OrderRequest = {
              idFood: food.idFood,
              quantity: this.quantity,
              noteFood: food.noteFood,
              nameFood: food.namefood,
              
            };    
           

          
            this.seletedListFood.push(orderRequest);
        }

        const currentFood = this.listOrderDetails.find(item => item.idFood === id);
        if (currentFood) {
            currentFood.quantity -= this.quantity;

            if (currentFood.quantity < 0) {
                currentFood.quantity = 0;
                this.openTotast("Số lượng bàn cũ không đủ");
            }
          if (this.listOrderDetails[index].quantity === 0) {
         
          this.listOrderDetails.splice(index, 1);
        }
            
            const orderRequestOld: OrderRequest = {
              idFood: food.idFood,
              quantity: food.quantity,
              noteFood: food.noteFood,
              nameFood: food.namefood,
              
            };
            console.log(orderRequestOld.quantity)
            this.seletedListUpdateFood.push(orderRequestOld);
            console.log( this.seletedListUpdateFood)
        }
    }
    
    
   
}
removeFromNewTable(index: number): void {
  const removedItem = this.seletedListFood[index];
  this.seletedListFood.splice(index, 1);
  const existingItem = this.listOrderDetails.find(item => item.idFood === removedItem.idFood);

  if (existingItem) {
      existingItem.quantity += removedItem.quantity;
  } else {
      this.listOrderDetails.push({
          idOrderDetail: 0, 
          idFood: removedItem.idFood,
          quantity: removedItem.quantity,
          price: 0, 
          totalPrice: 0, 
          noteFood: removedItem.noteFood || "",
          namefood: removedItem.nameFood,
          discount: 0, 
      });
  }
}
createNewOrder(): void {
  

  if (this.selectedTableId) {
    this.requestOrder.postNewOrder(this.seletedListFood, this.selectedTableId)
      .subscribe(
        response => {
          console.log('New order created:', response);
          this.openTotast('Đã tách bàn thành công!');
          this.seletedListFood = [];
          this.selectedTableId = null;
          this.route.params.subscribe(param => {
            let idOrder = param['idOrder'];
        
            if (idOrder) {
              this.requestOrder.updateOrder(idOrder, this.seletedListUpdateFood)
                .subscribe(
                  response => {
                    console.log('Order updated successfully:', response);
                    console.log('Đơn hàng cũ đã được cập nhật thành công!');
                  },
                  error => {
                    console.error('Error updating order:', error);
                    this.openTotast('Lỗi khi cập nhật đơn hàng cũ.');
                  }
                );
            }
          });
        },
        error => {
          console.error('Error creating new order:', error);
          this.openTotast('Lỗi khi tạo đơn hàng.');
        }
      );
  } else {
    this.openTotast('Vui lòng chọn bàn mới.');
  }
}
onTableSelectChange(mergerOrder: tableResponse | null): void  {
  if (mergerOrder) {
    
    const currentOrderId = mergerOrder.currentOrderId;
    const  idTable = mergerOrder.idTable;
    this.tableMergerId = idTable;
    this.mergerOrderId = currentOrderId;

    
    console.log('Selected currentOrderId:', currentOrderId);
    console.log('Selected idTable:', idTable);
    
    
    this.orderdetailsService.getOrderDetail(currentOrderId, idTable).subscribe(data => {
      console.log('DataOrderget: ', data.result)
      this.listOrderDetailsTableMerge = data.result
    })

  } else {
 
  } 
}
mergeOrder() {
  this.route.params.subscribe(param => {
    let idTable = param['idTable'];
    let idOrder = param['idOrder'];
    if(idTable == this.tableMergerId ){
      this.openTotast('Không thể gộp cùng 1 bàn lại với nhau.')
    }else{
      for (const element of this.listOrderDetailsTableMerge) {
        const existingItem = this.listOrderDetails.find(item => item.idFood === element.idFood);
        let orderRequestOld: OrderRequest;
    
        if (existingItem) {
          orderRequestOld = {
            idFood: element.idFood,
            quantity: element.quantity + existingItem.quantity,
            noteFood: element.noteFood,
            nameFood: element.namefood,
          };
        } else {
    
          orderRequestOld = {
            idFood: element.idFood,
            quantity: element.quantity,
            noteFood: element.noteFood,
            nameFood: element.namefood,
          };
        }
        this.seletedListMergerFood.push(orderRequestOld);
      }
      
      
      for (const element of this.listOrderDetailsTableMerge) {
        const existingItem = this.listOrderDetails.find(item => item.idFood === element.idFood);
    
        if (existingItem) {
    
          existingItem.quantity += element.quantity;
        } else {
          this.listOrderDetails.push({
            idOrderDetail: 0, 
            idFood: element.idFood,
            quantity: element.quantity,
            price: 0, 
            totalPrice: 0, 
            noteFood: element.noteFood || "",
            namefood: element.namefood,
            discount: 0, 
        });
        }
      }
      
    
        if (idOrder) {
          this.requestOrder.updateOrder(idOrder, this.seletedListMergerFood)
            .subscribe(
              response => {
                console.log('Order updated successfully:', response)
                const orderId = Number(this.mergerOrderId);
                this.requestOrder.deleteOrder(orderId).subscribe(
                  () => {
                    
                    console.log('Order deleted successfully');
                  },
                  (error) => {
                    console.error('Error deleting order:', error);
                  }
                );
                this.tableservice.updateTableStatus(this.tableMergerId, 'AVAILABLE').subscribe(data => {
                  console.log("Updated Table:", data);
                  this.ngOnInit()
                  console.log('Đã cập nhật trạng thái!')
                }, error => {
                  console.log('Đã cập nhật trạng thái!')
                  console.log("Error", error);
                });
                this.openTotast('Gộp bàn thành công!');
               
              },
              error => {
                console.error('Error updating order:', error);
                this.openTotast('Lỗi khi Gộp bàn.');
              }
            );
        }
      
    
      this.listOrderDetailsTableMerge = [];
    }

  });
}

openTotast(status: string) {
  this.snackBar.open
    (status, "Đóng", {
      duration: 4000,
      horizontalPosition: 'end', //  'start', 'end'
      verticalPosition: 'bottom', //  'bottom'
    })
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

