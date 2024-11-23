import { ShiftType } from "../Shift/shift-type";
import { OrderRespone } from "./order-respone";

export class ShiftRespone {
    idShift!:number|null;
    idUser!:String
    shiftType!:ShiftType
    listOrder!:OrderRespone[] | null
    cashAmount!:number
    isWorking!:boolean
    additionalCost!:number
    idShiftHandOver!:number
    bankAmount!:number
    
    constructor(idShift:number,idUser:String,shiftType:ShiftType,listOrder:OrderRespone[],
        isWorking:boolean,idShiftHandOver:number,bankAmount:number
        ,cashAmount:number,additionalCost:number
    ){

    }
    // private int idShift;
    // private String idUser;
    // private ShiftType shiftType;
    // private List<OrderEntity> listOrder;
    // private Boolean isWorking;
    // private int idShiftHandOver;
    // private double bankAmount;
    // private double cashAmount;
    // private double addtionalCost;
}
