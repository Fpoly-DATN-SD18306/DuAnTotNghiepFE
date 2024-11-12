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

  //biến lưu trữ các sản phẩm tạm thời
  tempProducts: OrderDetailResponse[] = []
  itemOrder: OrderRequest[] = []

  activeCategoryId: number | null = null;

  constructor(private tableservice: TableService, private snackBar: MatSnackBar,
    private routerActive: ActivatedRoute,
    private orderdetailsService: OrderdetailService,
    private orderService: OrderService,
    private productService: FoodService,
    private categoryService: CategoryService,
    private webSocketService: WebsocketService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.getData()
    this.getAllProducts()
    this.getAllCategories()
    this.notificationOrder()
  }

  getOrder(idOrder: number) {
    this.orderService.getOrder(idOrder).subscribe(data => {
      console.log('Data order: wwww', data.result);
      this.order = data.result
    })
  }

  getData() {
    this.routerActive.params.subscribe(param => {
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


  notificationOrder() {
    this.webSocketService.onMessage().subscribe(message => {
      if (message) {
        this.ngOnInit()
        console.log('ordermess:' + message)
      }
    });
  }
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


  // // ********************************************************************************************
  clickProduct(product: foodResponse,) {
    if (this.order) {
      this.addToTemp(product)
      // 
    } else {
      this.addToTemp(product)
    }
  }

  // Phương thức thêm sản phẩm vào danh sách tạm thời
  addToTemp(product: foodResponse) {
    // Kiểm tra xem sản phẩm đã tồn tại trong tempProducts chưa
    let existingProductInTemp = this.tempProducts.find(
      (item) => item.namefood === product.nameFood
    );
  
    if (existingProductInTemp) {
      // Nếu sản phẩm đã tồn tại trong tempProducts, tăng số lượng và cập nhật giá trị tổng
      existingProductInTemp.quantity++;
      existingProductInTemp.totalPrice = existingProductInTemp.quantity * product.priceFood;
    } else {
      // Nếu sản phẩm chưa tồn tại trong tempProducts, thêm sản phẩm mới vào danh sách tạm thời
      let orderDetail: OrderDetailResponse = {
        idOrderdetail: product.idFood,
        namefood: product.nameFood,
        quantity: 1,
        price: product.priceFood,
        totalPrice: product.priceFood,
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
      existingProductInList.quantity++;
      existingProductInList.totalPrice = existingProductInList.quantity * existingProductInList.price;
    } else {
      // Nếu sản phẩm chưa có trong listOrderDetails, thêm sản phẩm mới
      let newOrderDetail: OrderDetailResponse = {
        idOrderdetail: product.idFood,
        namefood: product.nameFood,
        quantity: 1,
        price: product.priceFood,
        totalPrice: product.priceFood,
        note: '',
        discount: product.discount,
      };
      this.listOrderDetails.push(newOrderDetail);
    }
    this.updateTotal()
  
    // Kiểm tra kết quả
    console.log('Temp Products: ', this.tempProducts);
    console.log('List Order Details: ', this.listOrderDetails);
  }
  

  //Save Order
  saveOrder(idTable: number) {
    this.tempProducts.forEach(product => {
      this.itemOrder.push(new OrderRequest(product.idOrderdetail, product.quantity));
    });
    this.orderService.createNewOrder(this.itemOrder, idTable)?.subscribe(data => {
      const idOrder = data.result.idOrder;
      this.router.navigate([`/admin/staff/tableorder_staff/orderprocessing/${idOrder}/${idTable}`]);
    }, error => {
      console.log("Error", error);
    })
    // if(idTable != null){
    //   alert('add');
    // }else{
    //   alert('edit');
    // }
  }
  
//Update order
  updateOrder(idOrder: number){
    this.tempProducts.forEach(product => {
      this.itemOrder.push(new OrderRequest(product.idOrderdetail, product.quantity));
    });
    this.orderService.updateOrder(idOrder, this.itemOrder).subscribe(data => {
      this.ngOnInit()
    }, error => {
      console.log("Error", error);
    })
  }

   // Cập nhật số lượng sản phẩm
   updateQuantity(item: OrderDetailResponse, isIncrease: boolean): void {
    if (isIncrease) {
      item.quantity++;
      item.totalPrice = item.quantity * item.price
      console.log('item:',item)
    } else {
      if (item.quantity > 1) {
        item.quantity--;
      console.log('item:',item)

      }
    }
    item.totalPrice = item.quantity * item.price;
    this.updateTotal(); // Cập nhật tổng tiền sau khi thay đổi số lượng
  }

   // Cập nhật tổng tiền đơn hàng
   updateTotal(): void {
    const total = this.listOrderDetails.reduce((sum, item) => sum + item.totalPrice, 0);
    if (this.order) {
      this.order.total = total;
    }
  }



  
}

