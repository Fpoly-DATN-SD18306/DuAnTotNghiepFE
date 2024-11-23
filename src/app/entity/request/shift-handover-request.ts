import { OrderRespone } from "../response/order-respone";

export class ShiftHandoverRequest {
    idUser!:String;
    listOrder!:OrderRespone[] | null;
    isWorking!:boolean;
    bankAmount!:number;
    cashAmount!:number;
    addtionalCost!:number

    constructor(idUser: String, listOrder:OrderRespone[] | null, isWorking:boolean,bankAmount:number,cashAmount:number,addtionalCost:number) {

    }
}
