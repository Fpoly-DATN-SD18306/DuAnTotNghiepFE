export class tableResponse{
    constructor(
        public idTable : number,
        public nameTable : String,
        public nameArea : String,
        public status : string,
        public locked : boolean,
        public linkImageQr : String,
        public nameImageQr : String,
        public displayName : String,
        // public hasOrder: boolean,
        public currentOrderId: number
    ){}

}