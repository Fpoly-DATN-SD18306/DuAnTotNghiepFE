import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private orderKey = 'orderIds'; // Key để lưu danh sách ID

  // Lưu một ID đơn hàng
  saveOrderId(orderId: number): void {
    const existingOrderIds = JSON.parse(localStorage.getItem(this.orderKey) || '[]');
    existingOrderIds.push(orderId);
    localStorage.setItem(this.orderKey, JSON.stringify(existingOrderIds));
  }

  // Lấy tất cả các ID đơn hàng
  getOrderIds(): number[] {
    return JSON.parse(localStorage.getItem(this.orderKey) || '[]');
  }

  // Xóa tất cả các ID đơn hàng
  clearOrderIds(): void {
    localStorage.removeItem(this.orderKey);
  }
}
