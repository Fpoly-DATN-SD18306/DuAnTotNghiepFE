import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { verifyTable } from '../../../service/verifyTable.service';
import { error, log } from 'console';
import { tableResponse } from '../../../entity/response/table-response';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  constructor(private route:Router,private router:ActivatedRoute,private  verifyTable : verifyTable){}
  tableCurrent !: tableResponse | null ; 


  callMenu(){
    this.route.navigate(['Menu']);
  }

  callStaff(){
    this.route.navigate(['Staff']);
  }


ngOnInit(): void {

  this.router.queryParams.subscribe(
    param=>{
      let idTable = param['table']
      let secretKey = param['secretKey']
      if(idTable && secretKey){
        this.verifyTable.getVerifyTable(idTable,secretKey).subscribe(
          data =>{
            verifyTable.tableVerified =  data.result
            this.tableCurrent=verifyTable.tableVerified
            console.log(data);
          }, error =>{
            console.log(error);
            // window.location.assign("/error")
          }
        );
      } else {
        // window.location.assign("/error")
      }   }  );
  
}


}
