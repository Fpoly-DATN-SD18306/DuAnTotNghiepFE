export class ApiRespone {

    code !: number;
    message !: String;
    result : any;

    constructor(code:number,message:String,result:any){
        this.code = code;
        this.message= message;
        this.result = result;
    }


}
