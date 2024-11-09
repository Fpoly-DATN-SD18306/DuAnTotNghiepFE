export interface Promotion {
  idPromotion: number;
  namePromotion: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  description?: string;
}
