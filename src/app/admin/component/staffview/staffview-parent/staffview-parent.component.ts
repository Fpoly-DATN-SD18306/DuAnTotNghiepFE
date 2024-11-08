import { Component, OnInit } from '@angular/core';
import { OrderRequest } from '../../../../entity/request/order-request';
import { WebsocketService } from '../../../../service/websocketService/websocket.service';
import { OrderResponse } from '../../../../entity/response/order-response';
import { Subject } from 'rxjs';
import { OrderdetailService } from '../../../../service/orderdetailService/orderdetail.service';
import { Router } from '@angular/router';
import { AudioService } from '../../../../service/audioService/audio.service';
import { OrderService } from '../../../../service/orderService/order.service';


@Component({
  selector: 'app-staffview-parent',
  templateUrl: './staffview-parent.component.html',
  styleUrl: './staffview-parent.component.css'
})
export class StaffviewParentComponent implements OnInit {

  orderMessages: { id: number; message: string; visible: boolean }[] = []; // Mảng chứa thông báo
  itemsorder!: OrderResponse
  private orderIdCounter = 0; // Đếm số lượng đơn hàng để gán ID cho thông báo


  constructor(
    private websocketservice: WebsocketService,
    private router: Router,
    private orderdetailsService: OrderdetailService,
    private audioService: AudioService,
    private orderService: OrderService
  ) { }
  ngOnInit(): void {
    this.websocketservice.connect()
    this.notificationOrder()
  }

  //************Thông báo đơn hàng */
  notificationOrder() {
    this.websocketservice.onMessage().subscribe(message => {
      if (message) {
        const orderData: OrderResponse = JSON.parse(message); // Chuyển đổi message thành OrderResponse
        this.orderMessages.push({ id: this.orderIdCounter, message: `[${orderData.nameTable}] có đơn hàng mới #${orderData.idOrder}`, visible: true });
        this.orderIdCounter++
        this.itemsorder = orderData
      }
      console.log('ordermess:' + message)
    });
  }

  fetchOrderDetails(idOrder: number | null, idTable: number | null) {
    this.orderdetailsService.getOrderDetail(idOrder, idTable).subscribe(
      data => {
        if (idOrder !== null) {
          // Điều hướng đến đường dẫn chỉ có idOrder
          this.router.navigate(['/admin/staff/tableorder_staff/orderprocessing', idOrder, idTable]);
        } else {
          console.error('idOrder is null or undefined');
          // Thực hiện xử lý khi idOrder không hợp lệ (nếu cần)
        }
        console.log('data', data);

        const notification = this.orderMessages.find(msg => msg.message.includes(`#${idOrder}`));
        if (notification) {
          notification.visible = false; // Đánh dấu thông báo là không hiển thị
        }
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  // confirmOrder(idOrder: number | null, idTable: number | null){
  //   this.orderService.confirmOrder(idOrder, idTable).subscribe(data => {
  //     console.log('Order confirmed', data.result)
  //     const notification = this.orderMessages.find(msg => msg.message.includes(`#${idOrder}`));
  //       if (notification) {
  //         notification.visible = false; // Đánh dấu thông báo là không hiển thị
  //       }
  //   },error => {
  //     console.log('Error', error)
  //   })
  // }

  confirmOrder(idOrder: number | null, idTable: number | null) {
    this.orderService.confirmOrder(idOrder, idTable).subscribe(data => {
      console.log('Order confirmed', data.result)

      const notification = this.orderMessages.find(msg => msg.message.includes(`#${idOrder}`));
      if (notification) {
        notification.visible = false; // Đánh dấu thông báo là không hiển thị
      }
    }, error => {
      console.log('Error', error)
    })


  }

  //Đóng thông báo / Closed notifications
  closedNotification(id: number) {
    const notification = this.orderMessages.find(msg => msg.id === id);
    if (notification) {
      notification.visible = false; // Đánh dấu thông báo là không hiển thị
    }
  }
}
