export class OrderDetailResponse{
    constructor(
        public idOrderDetail: number,
        public idFood:number,
        public quantity : number,
        public price : number,
        public totalPrice : number,
        public noteFood : string,
        public nameFood : string,
        public discount : number,
    ){}
}
