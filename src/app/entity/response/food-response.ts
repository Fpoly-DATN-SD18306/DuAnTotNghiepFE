export class foodResponse {

    constructor(
        public idFood: number, 
        public nameFood: string, 
        public priceFood: number, 
        public discount: number,
        public isSelling: Boolean, 
        public note: string, 
        public imgFood: string, 
        public idCategory: number) {

    }

}
