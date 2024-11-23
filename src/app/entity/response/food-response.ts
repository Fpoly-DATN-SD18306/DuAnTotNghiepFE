export class foodResponse {

    constructor(
        public idFood: number, 
        public nameFood: String, 
        public priceFood: number, 
        public discount: number,
        public isSelling: Boolean, 
        public note: String, 
        public imgFood: string, 
        public idCategory: number) {

    }

}
