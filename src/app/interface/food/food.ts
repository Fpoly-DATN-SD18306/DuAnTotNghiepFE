import { Category } from "../category/category";
import { User } from "../user/user";

export interface Food {
    idFood: number;
  nameFood: string;
  priceFood: number; // Change float to number for consistency
  isSelling: boolean;
  imgFood: string;
  userCreated?: User; // Optional property for user information
  listCategory?: Category; // Optional property for category information
  // Omit listOrderDetail as it's likely for internal use within the entity

}
