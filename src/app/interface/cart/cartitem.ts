import { Food } from "../food/food";

export interface Cartitem {
    product: Food;
  quantity: number;
  isSelected?: boolean;
//   discount?: number;
}
