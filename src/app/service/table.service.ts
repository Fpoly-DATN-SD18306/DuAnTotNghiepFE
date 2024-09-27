import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { ApiRespone } from '../entity/api-respone';
import { Observable } from 'rxjs';
import { tabelRequest } from '../entity/request/table-request';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient) { }

  getAlltable(page:number, size:number):Observable<ApiRespone>{
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables?page=${page}&size=${size}`)
  }

  getTable(idtable : number){
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables/${idtable}`);
  }

  createTable(request : tabelRequest):Observable<ApiRespone>{
    return this.http.post<ApiRespone>(this.url+'/api/v1/tables',request);
  }

  updateTable(request : tabelRequest, idtable : number):Observable<ApiRespone>{
     return this.http.put<ApiRespone>(`${this.url}/api/v1/tables/${idtable}`, request);
  }

  deleteTable(idtable : number):Observable<ApiRespone>{
    return this.http.delete<ApiRespone>(`${this.url}/api/v1/tables/${idtable}`);
  }
}
