import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {


   private showToastShiftEnd = new BehaviorSubject<boolean>(false);

   showToastShiftEnd$ = this.showToastShiftEnd.asObservable();
  
   
   private overlay = new BehaviorSubject<boolean>(false);

   overlay$ = this.showToastShiftEnd.asObservable();


  

   getToastStateEnd(): boolean {
     return this.showToastShiftEnd.value;
   }
 

   setToastStateEnd(state: boolean): void {
     this.showToastShiftEnd.next(state);
   }

   
}
