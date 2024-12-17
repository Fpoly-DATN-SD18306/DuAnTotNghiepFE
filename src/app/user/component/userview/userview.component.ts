import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-userview',
  templateUrl: './userview.component.html',
  styleUrl: './userview.component.css'
})
export class UserviewComponent implements OnInit {

ngOnInit(): void {
  window.addEventListener('beforeunload', function () {
    let itb = sessionStorage.getItem("itb");;
    this.sessionStorage.clear() 
    if(itb)
    this.sessionStorage.setItem("itb",itb);
  });

}

}
