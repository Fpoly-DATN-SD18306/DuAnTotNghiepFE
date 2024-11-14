export class OrderDetailRequest{
    constructor(
        public idFood:number,
        public quantity : number,
        public price : number,
        public totalPrice : number,
        public noteFood : string,
        public namefood : string,
        public discount : number,
    ){}
}
