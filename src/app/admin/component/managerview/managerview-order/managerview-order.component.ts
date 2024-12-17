import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../service/orderService/order.service';
import { OrderResponse } from '../../../../entity/response/order-response';
import { OrderdetailService } from '../../../../service/orderdetailService/orderdetail.service';
import { OrderDetailResponse } from '../../../../entity/response/orderdetail-response';
import { TableService } from '../../../../service/tableService/table.service';
import { tableStatusResponse } from '../../../../entity/response/tableStatus-response';

@Component({
  selector: 'app-managerview-order',
  templateUrl: './managerview-order.component.html',
  styleUrl: './managerview-order.component.css'
})
export class ManagerviewOrderComponent implements OnInit {
  constructor( 
    private orderService: OrderService,
    private orderdetailService: OrderdetailService,
    private tableservice: TableService
  ){}

  listOrders : OrderResponse [] = []
  listOrderDetails : OrderDetailResponse[] = []
  currentPage: number = 0
  pagesize: number = 8
  totalPages: number = 0
  pages: number[] = []
  idOrderSelect! : number
  orderSelect! : OrderResponse
  listStatuses! : tableStatusResponse[]


  filter = {
    statusOrder: '',
    idOrder: null,
    dateFrom: null,
    dateTo: null,
    searchKeyword: ''
  };

  showFilterForm = false;

  
  toggleFilterForm() {
    this.showFilterForm = !this.showFilterForm;
  }

  resetFilter() {
    this.filter = {
      statusOrder: '',
      idOrder: null,
      dateFrom: null,
      dateTo: null,
      searchKeyword: ''
    };
  }


  getFilterOrders(){
    const { statusOrder, idOrder, dateFrom, dateTo, searchKeyword } = this.filter;
    this.orderService.getFilteredOrders(statusOrder, idOrder, dateFrom, dateTo,searchKeyword, this.currentPage, 8).subscribe(data => {
      
      this.listOrders = data.result.content
      this.totalPages = data.result.totalPages
      this.pages = Array(this.totalPages).fill(0).map((x, i) => i)
      this.updatePagination()
    },error => {
   
    })
  }


  onSubmitFilter(){
    this.currentPage = 0
    this.getFilterOrders()
    this.showFilterForm = !this.showFilterForm;
  }
  reload(){
    this.currentPage = 0
    this.resetFilter()
    this.getFilterOrders()
    this.showFilterForm = false;

  }
// ********

  getOrderDetails(idOrderSelect:number){
    this.orderdetailService.getOrderDetail(idOrderSelect, null).subscribe(data => {
      this.listOrderDetails = data.result

    })
  }

  updatePagination() {
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + 2);
    this.pages = [];
    
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  openModal(idOrder : number){
    this.idOrderSelect = 0
    this.idOrderSelect = idOrder
    this.getOrderDetails(this.idOrderSelect)
    this.getOrder(this.idOrderSelect)
  }


  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getFilterOrders();
    }
  }

  
  getOrder(idOrderSelect:number){
    this.orderService.getOrder(idOrderSelect).subscribe(order => {
      this.orderSelect = order.result

    })
  }

  formatPrice(price: number|undefined) {
    return new Intl.NumberFormat('vi-VN').format(price || 0)
  }


  ngOnInit(): void {
    this.getFilterOrders()

  }
}
