export class OrderDetailResponse{
    constructor(
        public idOrderDetail: number,
        public quantity : number,
        public price : number,
        public totalPrice : number,
        public note : String,
        public namefood : String,
        public discount : number,
    ){}
}