import { OrderRespone } from "../response/order-respone";
import { ShiftType } from "../Shift/shift-type";

export class ShiftRequest {


    idUser!: string;
    idShiftType!: number;
    cashStart!: number;
    isWorkIng!: boolean;
    listOrder!:OrderRespone[] | null;
    constructor(idUser: String, idShiftType: number, listOrder:String,cashStart: number, isWorkIng: boolean) {

    }
    // @NotNull(message = "ID_USER_NOT_NULL")
    // private String idUser;
    // @NotNull(message = "ID_SHIFT_NOT_NULL")
    // private int idShiftType;

    // private List<OrderResponeDTO> listOrder;
    // private Double cashStart;
    // private Boolean isWorking;

}
