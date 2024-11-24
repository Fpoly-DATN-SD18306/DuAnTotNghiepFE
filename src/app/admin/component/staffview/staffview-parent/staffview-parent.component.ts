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
    private audioService : AudioService,
    private orderService: OrderService
  ) { }
  ngOnInit(): void {
    this.websocketservice.connect()
    this.notificationOrder()
    this.notificationPayment() 
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

  notificationPayment() {
    this.websocketservice.onPaymentMessage().subscribe(message => {
      if (message) {
        let obj = JSON.parse(message)
        this.speakText(obj.idOrder);
        this.ngOnInit()
        console.log('payment:' + message)
      }
    });
  }

  
  // Hàm để phát giọng nói
  speakText(idOrder : any) {
    const textToSpeak = "Đã nhận được thanh toán của đơn hàng số " + idOrder;
    console.log(textToSpeak);
    
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


  confirmOrder(idOrder: number) {
    // if (idOrder === null || idTable === null) { 
    //   console.log('Lỗi: idOrder hoặc idTable không hợp lệ!');
    //   return; 
    // }
    //  const oldIdOrder = sessionStorage.getItem(`order-${idTable}`);
    // this.audioService.pauseSound()
    // if (oldIdOrder) {
    //   this.orderService.confirmOrder(Number.parseInt(oldIdOrder), idOrder).subscribe(
    //     (data) => {
    //     },
    //     (error) => {
    //       console.log('Error', error);
    //     }
    //   );
    // } else {
    //   this.orderService.confirmOrder(idOrder, null).subscribe(
    //     (data) => {
    //       sessionStorage.setItem(`order-${idTable}`, idOrder!.toString());
    //     },
    //     (error) => {
    //       console.log('Error', error);
    //     }
    //   );
    // }

  }

  //Đóng thông báo / Closed notifications
  closedNotification(id: number) {
    this.audioService.pauseSound()
    const notification = this.orderMessages.find(msg => msg.id === id);
    if (notification) {
      notification.visible = false; // Đánh dấu thông báo là không hiển thị
    }
  }
}
