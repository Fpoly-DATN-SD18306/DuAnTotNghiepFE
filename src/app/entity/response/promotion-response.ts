export class PromotionReponse{

    constructor(
        public description: string,
        public discount: number,
        public endDate: Date,
        public idPromotion: number,
        public increasePrice: Boolean,
        public namePromotion: string,
        public startDate: Date
    ) {
    }

}
