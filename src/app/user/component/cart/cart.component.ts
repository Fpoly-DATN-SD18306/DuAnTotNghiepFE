import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Icart } from '../../../interface/cart/iCart';
import { ApiConfigService } from '../../../service/ApiConfigService';
import { CartService } from '../../../service/cartService/cart.service';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @Input() items: Icart[]=[];
  @Input() total: number = 0;
  @Input() paymentMethod: string = '';  
  pay: boolean = false;
  // isTienMatSelected = false;
  // isChuyenKhoanSelected = false;
  selectedPaymentMethod: string = 'tien-mat';
  // @Input() quantity:number=0;
  // @Output() quantityChange = new EventEmitter<number>();
  discount:number=0;
  srcImage = "./img/noImage1.jpg";
hostingImg = ApiConfigService.apiUrlimg;
readonly cartKey: string = 'myCart';

constructor(private cartService: CartService,private changeDetectorRef: ChangeDetectorRef, private router : Router,private platformLocation: PlatformLocation){}
calculateTotal() {
  this.total = this.items.reduce((acc, item) => {
    return acc + (item.price-this.discount) * item.quantity;
  }, 0);
}
onKeyDown(event: KeyboardEvent) {
  if (event.key === '-') {
    event.preventDefault();
  }
}
validQuantity(event:any) {
let inputData = event.target as HTMLInputElement;
inputData.value = inputData.value.replace(/[^0-9]/g, '');
const productId = parseInt(inputData.id);
const itemIndex = this.items.findIndex(item => item.idFood === productId);
const quantityRegex = /^[1-9]\d*$/;
if (itemIndex !== -1) {
  const inputValue = event.target.value;
  let quantity = parseInt(inputValue);
 
  if (quantityRegex.test(inputValue)) {
   
    this.items[itemIndex].quantity = quantity;
  } else {
    alert('Vui lòng nhập só lượng');
    quantity=inputData.valueAsNumber;
  }
} else {
  console.error('Không tìm thấy phần tử có ID', productId);
}
}

upQuantity(id: number) {
const index = this.items.findIndex((item: Icart) => item.idFood === id);
if (index !== -1) {
  this.items[index].quantity++;
}
this.updateQuantity(id,this.items[index].quantity)
}

downQuantity(id: number) {
const index = this.items.findIndex((item: Icart) => item.idFood === id);
if (index !== -1 && this.items[index].quantity > 1) {
  this.items[index].quantity--;
}
this.updateQuantity(id,this.items[index].quantity)
}

updateQuantity(id: number, quantity: number) {
const index = this.items.findIndex((item: Icart) => item.idFood === id);
if (index !== -1) {
  this.items[index].quantity = quantity;
  this.cartService.updateQuantity(id, quantity);
  this.calculateTotal();
  let hasProductWithQuantityLessThanOne = false;
  this.items.forEach(item => {
    if (item.quantity < 1) {
      hasProductWithQuantityLessThanOne = true;
    }
  });
  this.pay = hasProductWithQuantityLessThanOne;
}

}
deleteCart(id:number){
this.cartService.removeFromCart(id);
this.changeDetectorRef.detectChanges();
this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  this.router.navigate(['/Cart']);
});
this.cartService.getCart();
}
formatPrice(price :number){

  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
getAllCart(){
  this.items=this.cartService.getCart();
  this.changeDetectorRef.detectChanges();
}


onButtonClick(paymentMethod: string) {
  this.selectedPaymentMethod = paymentMethod;

}
ngOnInit(): void {
  console.log();
  this.getAllCart();

 if (this.items && this.items.length > 0) {

  this.items.forEach(item => {

    this.srcImage = this.hostingImg + item.thumbnail; 
  });
}
 this.calculateTotal();
}






}
