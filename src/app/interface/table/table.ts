import { Tablestatus } from "./tablestatus";

export interface Table {
idTable:number;
nameTable:string;
  isDeleted: boolean;
  status: Tablestatus
  location:string;
    
}
