import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiRespone } from '../entity/api-respone';
import { Observable } from 'rxjs';
import { tabelRequest } from '../entity/request/table-request';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient) { }

  getAllTablesASC(page: number, size: number, idArea: number): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables/sort/asc?page=${page}&size=${size}&idArea=${idArea}`);
  }
  

  getAlltableDESC(page: number, size: number, idArea: number): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables/sort/desc?page=${page}&size=${size}&idArea=${idArea}`)
  }

  //Get all tables not delete
  getAllTablesNotDeleted(): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables/by-not_deleted`)
  }

  //Get all statuses
  getAllStatuses(): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables/getAll-status`)
  }

  //update status table
  updateTableStatus(idtable: number, status: string): Observable<ApiRespone> {
    return this.http.put<ApiRespone>(`${this.url}/api/v1/tables/${idtable}/status`, { status })
  }

  getTable(idtable: number): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables/${idtable}`);
  }

  createTable(request: tabelRequest): Observable<ApiRespone> {
    return this.http.post<ApiRespone>(this.url + '/api/v1/tables', request);
  }

  updateTable(request: tabelRequest, idtable: number): Observable<ApiRespone> {
    return this.http.put<ApiRespone>(this.url + '/api/v1/tables/' + idtable, request);
  }

  deleteTable(idtable: number): Observable<ApiRespone> {
    return this.http.delete<ApiRespone>(`${this.url}/api/v1/tables/${idtable}`);
  }

  lockedTable(idtable: number): Observable<ApiRespone> {
    return this.http.put<ApiRespone>(`${this.url}/api/v1/tables/${idtable}/locked`, null);
  }


   // Hàm để gọi API với các tham số lọc
  //  getTablesFromFilter(nameTable: string, status: string, page: number, size: number): Observable<ApiRespone> {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('size', size.toString());

  //   if (nameTable) {
  //     params = params.set('nameTable', nameTable);
  //   }

  //   if (status) {
  //     params = params.set('status', status);
  //   }
  //   console.log('param'+params);
  //   return this.http.get<any>(`${this.url}/api/v1/tables/filter`, { params });
  // }

  getTablesByArea(nameTable: string, idArea: number, status: string, page: number, size: number): Observable<ApiRespone> {
    let params = new HttpParams()
      .set('nameTable', nameTable.toString())
      .set('idArea', idArea.toString())
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());
      console.log('params'+params);
  
    return this.http.get<ApiRespone>(`${this.url}/api/v1/tables/filter`, { params });
  }
  
  
}
