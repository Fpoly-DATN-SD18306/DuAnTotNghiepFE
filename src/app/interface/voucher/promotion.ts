export class Promotion {
  idPromotion!: number;
  namePromotion!: string;
  discount!: number;
  startDate!: Date;
  endDate!: Date;
  increasePrice!:boolean;
  description?: string;
}
