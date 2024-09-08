import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  list = Array(12);
  listType = Array(12);
  constructor(private route:Router,private router:ActivatedRoute){}

  activeLink1: String = '1';

  setActive( type :String ){
    this.activeLink1 = type;
  }

  pickProduct(id : number){
    this.route.navigate(['Product']);
  }
  
  findProduct(){
    
  }

}
