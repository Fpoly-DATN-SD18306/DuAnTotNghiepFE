export class OrderResponse  {

    constructor(
        public idOrder : number,
        public statusOrder : String,
        public nameTable : String,
        public idTable : number,
        public nameArea : String,
        public phoneCustomer : String,
        public total : number,
        public isPrinted : boolean
    ){
    }

}
