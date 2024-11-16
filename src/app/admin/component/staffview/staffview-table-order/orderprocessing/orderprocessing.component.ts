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
import { foodRequest } from '../../../../../entity/request/food-request';
import { OrderRequest } from '../../../../../entity/request/order-request';
import { IpServiceService } from '../../../../../service/ipService/ip-service.service';

@Component({
  selector: 'app-orderprocessing',
  templateUrl: './orderprocessing.component.html',
  styleUrl: './orderprocessing.component.css',
})
export class OrderprocessingComponent implements OnInit {
  listOrderDetails: OrderDetailResponse[] = [];
  listProducts: foodResponse[] = [];
  listCategories: CategoryResponse[] = [];
  itemTable?: tableResponse;
  order?: OrderResponse;
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
    private ipService : IpServiceService
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
          // Xử lý thành công nếu cần
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
            if(this.order== null){
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
        (data) => {;
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
      // Nếu chưa có order, thêm sản phẩm vào danh sách tạm thời
      this.addToTemp(product);
    }
  }

  // Phương thức thêm sản phẩm vào danh sách tạm thời
  addToTemp(product: foodResponse) {
    // Kiểm tra xem sản phẩm đã tồn tại trong tempProducts chưa
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

    // Kiểm tra kết quả
    console.log('Temp Products: ', this.tempProducts);
    console.log('List Order Details: ', this.listOrderDetails);
  }



  //Update order
  updateOrder(idOrder: number, itemOrder: OrderRequest) {
    if (!itemOrder) return;
    this.orderService.updateOrder(idOrder, itemOrder).subscribe(
      (data) => {
        console.log('Order updated successfully', data);
        this.getDataOrderdetail(); // Refresh dữ liệu nếu cần
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
    this.updateTotal(); // Cập nhật tổng tiền sau khi thay đổi số lượng
    console.log('Temppr: ',this.tempProducts)
    console.log('ListOrr: ',this.listOrderDetails)
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
      // Kiểm tra nếu là phần tử cuối cùng trong danh sách
      if (this.listOrderDetails.length === 1) {
        // Hiển thị modal yêu cầu nhập lý do hủy
        this.showCancelModal(idOrderDetail);
      } else {
        // Xóa phần tử nếu không phải phần tử cuối
        this.executeRemove(idOrderDetail);
      }
    } else {
      // Nếu không có order, xóa trực tiếp từ listOrderDetails và tempProducts
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
    // Mở modal để yêu cầu người dùng nhập lý do hủy
    const modalElement = document.getElementById('cancelModal');
    if (modalElement) {
      modalElement.style.display = 'block';
    }
    // Lưu idOrderDetail của item cần xóa
    this.itemOrderDetailToCancel = idOrderDetail;
  }
  
  cancelModalClose() {
    // Đóng modal khi nhấn hủy
    const modalElement = document.getElementById('cancelModal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  }
  
  confirmCancel() {
    // Xóa phần tử khi xác nhận
    if (this.itemOrderDetailToCancel) {
      this.executeRemove(this.itemOrderDetailToCancel);
    }
    this.cancelModalClose();
  }
  
  executeRemove(idOrderDetail: number) {
    // Thực hiện xóa phần tử
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

  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN').format(price)
  }


}
