export interface Voucher {
  idPromotion: number;
  namePromotion: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  description?: string;
}
