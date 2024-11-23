import { Injectable } from '@angular/core';
import { ShiftRequest } from '../../entity/request/shift-request';
import { Observable } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShiftServiceService {

  constructor(private http : HttpClient) { }

    url = 'http://localhost:8080/api/v1/shift';

    

    createShift(shiftRequest : ShiftRequest):Observable<ApiRespone>{
      return this.http.post<ApiRespone>(this.url,shiftRequest)
    }

    findShift(isEnding:boolean,idShiftType:number):Observable<ApiRespone>{
      return this.http.get<ApiRespone>(this.url+"?isEnding="+isEnding+"&idShiftType="+idShiftType);
    }

    

   }
