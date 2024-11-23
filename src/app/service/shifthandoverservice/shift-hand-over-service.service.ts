import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';
import { ShiftHandoverRequest } from '../../entity/request/shift-handover-request';

@Injectable({
  providedIn: 'root'
})
export class ShiftHandOverServiceService {
  url = 'http://localhost:8080/api/v1/shift';
  
  constructor(private http:HttpClient) {    
  }

  CreateHandOver(id:number,shiftHandover:ShiftHandoverRequest):Observable<ApiRespone>{
    return this.http.post<ApiRespone>(this.url+"/"+id,shiftHandover)
  }


}
