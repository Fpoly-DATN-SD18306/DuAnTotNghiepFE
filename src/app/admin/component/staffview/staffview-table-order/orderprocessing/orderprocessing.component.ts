import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { foodRequest } from '../../../../../entity/request/food-request';
import { OrderRequest } from '../../../../../entity/request/order-request';
import { IpServiceService } from '../../../../../service/ipService/ip-service.service';

@Component({
  selector: 'app-orderprocessing',
  templateUrl: './orderprocessing.component.html',
  styleUrl: './orderprocessing.component.css',
})
export class OrderprocessingComponent implements OnInit {
  listOrderDetails: OrderDetailResponse[] = []
  listProducts: foodResponse[] = []
  listCategories: CategoryResponse[] = []
  itemTable?: tableResponse
  order?: OrderResponse
  itemOrderdetail!: OrderDetailResponse;

  //biến lưu trữ các sản phẩm tạm thời
  tempProducts: OrderDetailResponse[] = [];
  itemOrder: OrderRequest[] = [];
  iOrder!: OrderRequest;
  activeCategoryId: number | null = null;
  tempTotal!: number

  //lưu trữ idOrder cũ
  oldIdOrders: Map<number, number | null> = new Map();
  cancelReason: string = '';
  itemOrderDetailToCancel: number | null = null;


  constructor(
    private tableservice: TableService,
    private snackBar: MatSnackBar,
    private routerActive: ActivatedRoute,
    private orderdetailsService: OrderdetailService,
    private orderService: OrderService,
    private productService: FoodService,
    private categoryService: CategoryService,
    private webSocketService: WebsocketService,
    private router: Router,
    private ipService: IpServiceService,
    private paymentService : PaymentService,
    private invoiceService : InvoiceService
  ) { }

  ngOnInit(): void {
    this.getDataOrderdetail();
    this.getAllProducts();
    this.getAllCategories();
    this.notificationOrder();
  }

  getOrder(idOrder: number) {
    this.orderService.getOrder(idOrder).subscribe((data) => {
      console.log('Data order: wwww', data.result);
      this.order = data.result;

      console.log('status: ' + this.order?.statusOrder);
    });
  }

  checkStatusOrder(idTable: number) {
    console.log('Status: ', this.order?.statusOrder);
    if (
      this.order?.statusOrder === 'Completed' ||
      this.order?.statusOrder === 'Cancelled'
    ) {
      this.tableservice.updateTableStatus(idTable, 'AVAILABLE').subscribe(
        (data) => {
        },
        (error) => {
          console.log('Error', error);
        }
      );
    } else {
      console.log('lllllll');
    }
  }

  getDataOrderdetail() {
    this.routerActive.params.subscribe((param) => {
      let idOrder = param['idOrder'];
      let idTable = param['idTable'];
      if (idOrder != undefined) {
        this.getOrder(idOrder);
        this.orderdetailsService
          .getOrderDetail(idOrder, idTable)
          .subscribe((data) => {
            this.listOrderDetails = data.result;
            if (this.order == null) {
              sessionStorage.removeItem(`order-${idTable}`)
            }
          });
      } else {
        this.tableservice.getTable(idTable).subscribe((data) => {
          this.itemTable = data.result;
        });
      }
    });
  }

  confirmOrder(idOrder: number | null, idTable: number | null) {
    if (idOrder === null || idTable === null) {
      return;
    }
    const oldIdOrder = sessionStorage.getItem(`order-${idTable}`);

    if (oldIdOrder) {
      this.orderService.confirmOrder(Number.parseInt(oldIdOrder), idOrder).subscribe(
        (data) => {
          ;
          this.router.navigate(['/admin/staff/tableorder_staff/orderprocessing', oldIdOrder, idTable]);
        },
        (error) => {
          console.log('Error', error);
        }
      );
    } else {
      this.orderService.confirmOrder(idOrder, null).subscribe(
        (data) => {
          sessionStorage.setItem(`order-${idTable}`, idOrder!.toString());
          this.getDataOrderdetail()
        },
        (error) => {
          console.log('Error', error);
        }
      );
    }
  }


  //Save Order
  saveOrder(idTable: number) {
    this.tempProducts.forEach((product) => {
      this.itemOrder.push(
        new OrderRequest(product.idOrderDetail, product.quantity)
      );
    });
    this.orderService.createNewOrder(this.itemOrder, idTable)?.subscribe(
      (data) => {
        const idOrder = data.result.idOrder;
        console.log('Updated Map in saveOrder: ', this.oldIdOrders);
        this.router.navigate([
          `/admin/staff/tableorder_staff/orderprocessing/${idOrder}/${idTable}`,
        ]);
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  notificationOrder() {
    this.webSocketService.onMessage().subscribe((message) => {
      if (message) {
        this.getDataOrderdetail();
        console.log('ordermess:' + message);
      }
    });
  }
  // ********************************
  getAllProducts() {
    this.productService.getAllList().subscribe(
      (data) => {
        this.activeCategoryId = null;
        this.listProducts = data.result.content;
        console.log('Data product', data.result.content);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  getAllCategories() {
    this.categoryService.getAllCate().subscribe((data) => {
      console.log('Category: ', data.result);
      this.listCategories = data.result;
    });
  }

  getByIdCategory(idCategory: number) {
    this.productService.getByIdCategory(idCategory).subscribe((data) => {
      this.activeCategoryId = idCategory;
      this.listProducts = data.result;
      console.log('data food by category', data.result);
    });
  }


  // // ********************************************************************************************
  clickProduct(product: foodResponse) {
    console.log('idFood', product.idFood);
    if (this.order) {
      // Nếu đã có order, cập nhật order hiện tại
      let existingProductInList = this.listOrderDetails.find(
        (item) => item.namefood === product.nameFood
      );

      if (!existingProductInList) {
        // Nếu sản phẩm chưa có trong danh sách, tạo đối tượng mới
        let newOrderDetail: OrderDetailResponse = {
          idOrderDetail: product.idFood,
          namefood: product.nameFood,
          quantity: 1,
          price: product.priceFood,
          totalPrice: product.priceFood,
          note: '',
          discount: product.discount,
        };
        this.listOrderDetails.push(newOrderDetail);
      }
      this.iOrder = new OrderRequest(product.idFood, 1, product.note);
      console.log('update', this.listOrderDetails);
      this.updateOrder(this.order.idOrder, this.iOrder);
    } else {
      this.addToTemp(product);
    }
  }

  // Thêm sản phẩm vào danh sách tạm thời
  addToTemp(product: foodResponse) {
    let existingProductInTemp = this.tempProducts.find(
      (item) => item.namefood === product.nameFood
    );

    if (existingProductInTemp) {
      console.log('quantityProductTemp');
      // Nếu sản phẩm đã tồn tại trong tempProducts, tăng số lượng và cập nhật giá trị tổng
      existingProductInTemp.quantity++;
      existingProductInTemp.totalPrice = existingProductInTemp.price *
        existingProductInTemp.quantity * ((100 - existingProductInTemp.discount) / 100);
    } else {
      // Nếu sản phẩm chưa tồn tại trong tempProducts, thêm sản phẩm mới vào danh sách tạm thời
      let orderDetail: OrderDetailResponse = {
        idOrderDetail: product.idFood,
        namefood: product.nameFood,
        quantity: 1,
        price: product.priceFood,
        totalPrice: product.priceFood * ((100 - product.discount) / 100),
        note: '',
        discount: product.discount,
      };
      this.tempProducts.push(orderDetail);
    }

    // Cập nhật hoặc thêm sản phẩm vào listOrderDetails
    let existingProductInList = this.listOrderDetails.find(
      (orderDetail) => orderDetail.namefood === product.nameFood
    );

    if (existingProductInList) {
      // Nếu sản phẩm đã tồn tại trong listOrderDetails, chỉ tăng số lượng của sản phẩm đó
      console.log('quantityproductList');
      existingProductInList.quantity++;
      existingProductInList.totalPrice = existingProductInList.price *
        existingProductInList.quantity * ((100 - existingProductInList.discount) / 100)
    } else {
      // Nếu sản phẩm chưa có trong listOrderDetails, thêm sản phẩm mới
      let newOrderDetail: OrderDetailResponse = {
        idOrderDetail: product.idFood,
        namefood: product.nameFood,
        quantity: 1,
        price: product.priceFood,
        totalPrice: product.priceFood * ((100 - product.discount) / 100),
        note: '',
        discount: product.discount,
      };
      this.listOrderDetails.push(newOrderDetail);
    }
    this.updateTotal();
  }



  //Update order
  updateOrder(idOrder: number, itemOrder: OrderRequest) {
    if (!itemOrder) return;
    this.orderService.updateOrder(idOrder, itemOrder).subscribe(
      (data) => {
        console.log('Order updated successfully', data);
        this.getDataOrderdetail(); 
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  // Cập nhật tổng tiền đơn hàng
  updateTotal() {
    const total = this.listOrderDetails.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    if (this.order) {
      this.order.total = total;
    } else {
      this.tempTotal = total
      console.log()
    }
  }

  updateQuantityTemp(item: OrderDetailResponse, newQuantity: number) {
    if (newQuantity < 1) {
      return;
    }

    let existingProductInTemp = this.tempProducts.find(
      (itemor) => itemor.namefood === item.namefood
    );

    if (existingProductInTemp) {
      console.log('quantityProductTemp');
      existingProductInTemp.quantity = newQuantity;
    }

    let existingProductInList = this.listOrderDetails.find(
      (orderDetail) => orderDetail.namefood === item.namefood
    );

    if (existingProductInList) {
      // Nếu sản phẩm đã tồn tại trong listOrderDetails, chỉ tăng số lượng của sản phẩm đó
      console.log('quantityproductList');
      existingProductInList.quantity = newQuantity;


    }
    item.totalPrice = item.price * item.quantity * ((100 - item.discount) / 100)
    this.updateTotal();
    console.log('Temppr: ', this.tempProducts)
    console.log('ListOrr: ', this.listOrderDetails)
  }

  //cập nhật số lượng orderdetail
  updateQuantity(idOrder: number, idOrderDetail: number, newQuantity: number) {
    if (newQuantity < 1) {
      return;
    }
    this.orderService
      .updateOrderDetailQuantity(idOrder, idOrderDetail, newQuantity)
      .subscribe(
        (data) => {
          this.getDataOrderdetail();
          console.log('Success update quantity', idOrderDetail);
        },
        (err) => {
          console.log('Error', err);
        }
      );
  }

  removeOrderDetails(idOrderDetail: number) {
    if (this.order) {
      if (this.listOrderDetails.length === 1) {
        // Hiển thị modal yêu cầu nhập lý do hủy
        this.showCancelModal(idOrderDetail);
      } else {
        // Xóa phần tử nếu không phải phần tử cuối
        this.executeRemove(idOrderDetail);
      }
    } else {
      this.listOrderDetails = this.listOrderDetails.filter(
        (orderDetail) => orderDetail.idOrderDetail !== idOrderDetail
      );
      this.tempProducts = this.tempProducts.filter(
        (tempProduct) => tempProduct.idOrderDetail !== idOrderDetail
      );
      this.updateTotal();
    }
  }

  showCancelModal(idOrderDetail: number) {
    const modalElement = document.getElementById('cancelModal');
    if (modalElement) {
      modalElement.style.display = 'block';
    }
    this.itemOrderDetailToCancel = idOrderDetail;
  }

  cancelModalClose() {
    const modalElement = document.getElementById('cancelModal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  }

  confirmCancel() {
    if (this.itemOrderDetailToCancel) {
          this.executeRemove(this.itemOrderDetailToCancel!);
        }
    this.cancelModalClose();
  }


  executeRemove(idOrderDetail: number) {
    this.orderService.removeOrderDetail(idOrderDetail).subscribe(
      (data) => {
        this.getDataOrderdetail();
          setTimeout(() => {
            if (this.listOrderDetails.length === 0) {
              sessionStorage.removeItem(`order-${this.order?.idTable}`);
              this.routerActive.params.subscribe((param) => {
                let idTable = param['idTable'];
                this.router.navigate([
                  `/admin/staff/tableorder_staff/orderprocessing/${idTable}`,
                ]);
              });
            }
          }, 100);
      },
      (err) => {
        console.log('Delete fail!', err);
      }
    );
  }



  openModalCancel() {
    const modalElement = document.getElementById('cancelModal');
    if (modalElement) {
      modalElement.style.display = 'block';
    }
  }

  handleCancelAction() {
    if (this.cancelReason.trim() !== '') {
      if (this.itemOrderDetailToCancel) {
        this.executeRemove(this.itemOrderDetailToCancel);
      } else {
        const oldIdOrder = sessionStorage.getItem(`order-${this.order?.idTable}`);
        if (Number(oldIdOrder) != 0) {
          this.orderService.cancelOrder(Number(oldIdOrder), this.order!.idOrder, this.cancelReason).subscribe(
            (res) => {
              this.router.navigate(['/admin/staff/tableorder_staff/orderprocessing', Number(oldIdOrder), this.order!.idTable]);
            },
            (error) => {
              console.log('Error', error);
            }
          );
        } else {
          this.orderService.cancelOrder(0, this.order!.idOrder, this.cancelReason).subscribe(
            (res) => {
              this.router.navigate(['/admin/staff/tableorder_staff/orderprocessing', this.order!.idTable]);
            },
            (error) => {
              console.log('Error', error);
            }
          );
        }
      }

    }
    this.cancelReason = ''; 
    this.cancelModalClose();
  }



  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN').format(price)
  }



  paymentPaythod = "cash"

  errorCode: Record<number, string> =
    { 1601: "Đơn hàng đã được hoàn thành trước đó !" }

  listDataInvoice  !: invoiceRespone[];

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

