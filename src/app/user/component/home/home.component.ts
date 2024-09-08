import { Component } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  

  constructor(private route:Router,private router:ActivatedRoute){}

  callMenu(){
    this.route.navigate(['Menu']);
  }
  callStaff(){
    this.route.navigate(['Staff']);
  }
}
