import { Component, OnInit } from '@angular/core';
import { OrderRequest } from '../../../../entity/request/order-request';
import { WebsocketService } from '../../../../service/websocketService/websocket.service';
import { OrderResponse } from '../../../../entity/response/order-response';
import { Subject } from 'rxjs';
import { OrderdetailService } from '../../../../service/orderdetailService/orderdetail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioService } from '../../../../service/audioService/audio.service';
import { OrderService } from '../../../../service/orderService/order.service';


@Component({
  selector: 'app-staffview-parent',
  templateUrl: './staffview-parent.component.html',
  styleUrl: './staffview-parent.component.css'
})
export class StaffviewParentComponent implements OnInit {

  orderMessages: { id: number; message: string; visible: boolean; order: OrderResponse }[] = [];
  itemsorder!: OrderResponse
  private orderIdCounter = 0; // Đếm số lượng đơn hàng để gán ID cho thông báo


  constructor(
    private websocketservice: WebsocketService,
    private router: Router,
    private orderdetailsService: OrderdetailService,
    private audioService : AudioService,
    private orderService: OrderService,
    private route : ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.websocketservice.connect()
    this.notificationOrder()
    this.notificationPayment() 
    this.route.queryParams.subscribe((params) => {
      if (params['reload']) {
        this.websocketservice.connect()
        this.notificationOrder()
        this.notificationPayment() 
      }
    });
  }

  //************Thông báo đơn hàng */
  notificationOrder() {
    this.websocketservice.onMessage().subscribe(message => {
      if (message) {
        this.itemsorder = JSON.parse(message); // Chuyển đổi message thành OrderResponse
        if(this.itemsorder.idOrderMain === null){
          this.orderMessages.push({ 
            id: this.itemsorder.idOrder, 
            message: `[${this.itemsorder.nameTable}] có đơn hàng mới #${this.itemsorder.idOrder}`, 
            visible: true, 
            order: this.itemsorder // Lưu thông tin đơn hàng vào thông báo
          });
          this.orderIdCounter++;
        }else{
          this.orderMessages.push({ 
            id: this.itemsorder.idOrder, 
            message: `[${this.itemsorder.nameTable}] khách hàng gọi thêm món`, 
            visible: true, 
            order: this.itemsorder // Lưu thông tin đơn hàng vào thông báo
          });
          this.orderIdCounter++;
        }
          if(this.itemsorder.statusOrder == 'Waiting'){
          this.audioService.playSound()
        }
      }
      console.log('ordermess:', message);
    });
  }


 
  notificationPayment() {
    this.websocketservice.onPaymentMessage().subscribe(message => {
      if (message) {
        let obj = JSON.parse(message)
        if(obj.rspCode=='00'){
          this.speakText(obj.idOrder);
          window.location.reload();
        }
        this.ngOnInit()
        console.log('payment:' + message)
      }
    });
  }

  


    fetchOrderDetails(idOrder: number | null, idTable: number | null) {
      this.pauseSound()
      this.orderMessages.forEach((message) => {
        console.log('mess',message.id)
        console.log('idorder',idOrder)
        if (message.id === idOrder) {
          message.visible = false; 
        }
      });
        this.orderdetailsService.getOrderDetail(idOrder, idTable).subscribe(
          (orderDetails) => {
            this.router.navigate(['/admin/staff/tableorder_staff/orderprocessing', idOrder, idTable]);
          },
          (error) => {
            console.error('Lỗi khi lấy chi tiết đơn hàng theo ID Order:', error);
          }
        );
      
    }
    

    pauseSound(){
      this.audioService.pauseSound()
    }

  confirmOrder(idOrder: number | null) {
    this.orderMessages.forEach((message) => {
      console.log('mess',message.id)
      console.log('idorder',idOrder)
      this.pauseSound()
      if (message.id === idOrder) {
        message.visible = false; 
      }
    })
    this.orderService.confirmOrder(idOrder).subscribe(
      (data) => {
        console.log('data',data)
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  //Đóng thông báo / Closed notifications
  closedNotification(id: number) {
    this.audioService.pauseSound()
    const notification = this.orderMessages.find(msg => msg.id === id);
    if (notification) {
      notification.visible = false; // Đánh dấu thông báo là không hiển thị
    }
  }



  speakText(idOrder : any) {
    const textToSpeak = " Đã nhận được thanh toán của đơn hàng số " + idOrder;
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
}
