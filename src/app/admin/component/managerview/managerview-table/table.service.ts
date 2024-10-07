import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table } from '../../../../interface/table/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private apiUrl = 'http://localhost:8080/api/tables'; // Thay thế bằng URL của API của bạn

  constructor(private http: HttpClient) {}

  // getTables(): Observable<Table[]> {
  //   return this.http.get<Table[]>(this.apiUrl);
  // }
  getTables(filters?: { status?: string }, searchTerm?: string, sortBy?: string, sortOrder?: string): Observable<Table[]> {
    let url = this.apiUrl;
    let params = new HttpParams();

    if (filters) {
      if (filters.status) {
        params = params.append('status', filters.status);
      }
    }

    if (searchTerm) {
      params = params.append('tableName', searchTerm);
    }

    if (sortBy && sortOrder) {
      params = params.append('sortBy', sortBy);
      params = params.append('sortOrder', sortOrder);
    }

    url = `${url}?${params.toString()}`;
    return this.http.get<Table[]>(url);
  }
  deleteTable(tableId: number): Observable<any> {
    const url = `${this.apiUrl}/${tableId}`;
    return this.http.put<any>(url, { isDeleted: true });
  }
  addTable(table: Table): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table);
  }
  searchTables(tableName: string): Observable<Table[]> {
    const params = new HttpParams()
      .set('tableName', tableName)
 

    return this.http.get<Table[]>(this.apiUrl, { params });
  } 
}
