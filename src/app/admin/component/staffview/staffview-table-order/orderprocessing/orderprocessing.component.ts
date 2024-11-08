import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableService } from '../../../../../service/tableService/table.service';
import { WebsocketService } from '../../../../../service/websocketService/websocket.service';
import { OrderdetailService } from '../../../../../service/orderdetailService/orderdetail.service';
import { OrderDetailResponse } from '../../../../../entity/response/orderdetail-response';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../service/orderService/order.service';
import { OrderResponse } from '../../../../../entity/response/order-response';
import { Console, error } from 'console';
import { tableResponse } from '../../../../../entity/response/table-response';
import { FoodService } from '../../../../../service/foodService/food.service';
import { foodResponse } from '../../../../../entity/response/food-response';
import e from 'express';
import { CategoryService } from '../../../../../service/categoryService';
import { CategoryResponse } from '../../../../../entity/response/category-response';

@Component({
  selector: 'app-orderprocessing',
  templateUrl: './orderprocessing.component.html',
  styleUrl: './orderprocessing.component.css'
})
export class OrderprocessingComponent implements OnInit {
  listOrderDetails : OrderDetailResponse[] = []
  listProducts : foodResponse[] = []
  listCategories : CategoryResponse[] = []
  itemTable? : tableResponse
  order? :OrderResponse

  activeCategoryId: number | null = null;

  constructor(private tableservice: TableService, private snackBar: MatSnackBar,
    private router : ActivatedRoute,
    private orderdetailsService: OrderdetailService,
    private orderService: OrderService,
    private productService: FoodService,
    private categoryService: CategoryService,
    private webSocketService: WebsocketService

    ) { }

    ngOnInit(): void {
      this.getData()
      this.getAllProducts()
      this.getAllCategories()
      this.notificationOrder()
    }

    getOrder(idOrder: number){
      this.orderService.getOrder(idOrder).subscribe(data => {
        console.log('Data order: wwww',data.result);
        this.order = data.result
      })
    }

    getData(){
    this.router.params.subscribe(param => {
      let idOrder = param['idOrder']
      let idTable = param['idTable']
      if(idOrder!= undefined){
        this.getOrder(idOrder)
        console.log('IDORDER: ',idOrder)
        this.orderdetailsService.getOrderDetail(idOrder,idTable).subscribe(data => {
          console.log('DataOrderget: ',data.result)
          this.listOrderDetails = data.result
        })
      }else{
        this.tableservice.getTable(idTable).subscribe(data => {
          this.itemTable = data.result
        })
      }
    })
  }
  
  confirmOrder(idOrder: number | null, idTable: number | null){
    this.orderService.confirmOrder(idOrder, idTable).subscribe(data => {
      console.log('Order confirmed', data.result)
    },error => {
      console.log('Error', error)
    })
  }


  notificationOrder(){
    this.webSocketService.onMessage().subscribe(message => {
        if(message){
          this.ngOnInit()
        console.log('ordermess:'+message)
        }
    });
  }
  // ********************************
  getAllProducts(){
    this.productService.getAllList().subscribe(data => {
      this.activeCategoryId = null;
      this.listProducts = data.result.content
      console.log('Data product', data.result.content)
    },err => {
      console.log('Error', err)
    })
  }

  getAllCategories(){
    this.categoryService.getAllCate().subscribe(data => {
      console.log('Category: ', data.result)
      this.listCategories = data.result
    })
  }

  getByIdCategory(idCategory: number){
    this.productService.getByIdCategory(idCategory).subscribe(data => {
      this.activeCategoryId = idCategory;
      this.listProducts = data.result
      console.log('data food by category', data.result)
    })
  }
}

