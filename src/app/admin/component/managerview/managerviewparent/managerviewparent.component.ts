import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managerviewparent',
  templateUrl: './managerviewparent.component.html',
  styleUrl: './managerviewparent.component.css'
})
export class ManagerviewparentComponent implements OnInit {

    constructor (private router : Router ,@Inject(PLATFORM_ID) private platformId: Object){}
    // some value currentView : managerTable, managerFood 
    currentView = "";

  activeButton(ButtonActive:string,firtUrl:string) {
    if(firtUrl !=""){
     
      this.currentView = firtUrl
    } else {
      this.currentView = ButtonActive;
    }
    console.log(this.currentView )
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const screenWidth = window.innerWidth;
   
    this.activeButton('',window.location.pathname.split("/")[3]) 

    }

  }

}