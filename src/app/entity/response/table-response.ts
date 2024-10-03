export class tableResponse{
    constructor(
        public idTable : number,
        public nameTable : String,
        public status : string,
        public deleted : boolean,
        public displayName : String
    ){}

    getDisplayName(status: String) {
        switch (status) {
          case 'AVAILABLE':
            return 'Bàn trống';
          case 'OCCUPIED':
            return 'Đang phục vụ';
          case 'CLEANING':
            return 'Đang dọn';
          case 'RESERVED':
            return 'Đặt trước';
          case 'BILL_REQUESTED':
            return 'Yêu cầu thanh toán';
          default:
            return 'Không xác định';
        }
      }
}