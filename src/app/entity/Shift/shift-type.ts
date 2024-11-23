export class ShiftType {
    idShift!: number;
    nameShift!: String;
    startTime!: String;
    endTime!:String;


    constructor(idShift:number,nameShift:String,startTime:String,endTime:String){
        this.idShift = idShift;
        this.nameShift = nameShift;
        this.startTime = startTime;
        this.endTime = endTime;
    }



    getShiftType(date: string): ShiftType | null {
        for (const shift of shifts) {
            if (date > shift.startTime && date < shift.endTime) {
                return shift;
            }
        }
        return null;
    }
}
export const shifts: ShiftType[] = [
    new ShiftType(1, '1', "07:00", "11:00"),
    new ShiftType(2, '2', "11:01", "14:00"),
    new ShiftType(3, '3', "14:01", "17:00"),
    new ShiftType(4, '4', "17:01", "21:00")
];

