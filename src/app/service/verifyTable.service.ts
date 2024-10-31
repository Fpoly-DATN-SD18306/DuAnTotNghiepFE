import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiRespone } from '../entity/api-respone';
import { Observable } from 'rxjs';
import { tabelRequest } from '../entity/request/table-request';
import { tableResponse } from '../entity/response/table-response';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class verifyTable {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient) { }
  static  tableVerified : tableResponse | null ;
 
  
  getVerifyTable(idTable :number,secretKey:number):Observable<ApiRespone> {
     let resquest =  {  
      "idTable"  :idTable,
      "secretKey" : secretKey
    }
    return this.http.post<ApiRespone>(`${this.url}/api/verify-table`,resquest)
  }

 
  
  // VerifyTable(idTable :number,secretKey:number):Observable<tableResponse|null>{
  //   return new Observable (  observer =>{
  //     this.getVerifyTable(idTable,secretKey).subscribe(
  //       data =>{
  //         console.log(data.result);
  //         verifyTable.tableVerified = data.result   
  //       } 
  //       ,error =>{
  //         console.log(error);
          
  //         verifyTable.tableVerified = null ;
  //       }
  //       )

  //   })
      


  // }
  
 
  
  
}
