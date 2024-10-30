import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';
import { AreaRequest } from '../../entity/request/area-request';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient) {}

  getAllAreas():Observable<ApiRespone>{
    return this.http.get<ApiRespone>(`${this.url}/api/v1/areas`)
  }

  getArea(idarea: number): Observable<ApiRespone> {
    return this.http.get<ApiRespone>(`${this.url}/api/v1/areas/${idarea}`);
  }

  createArea(request : AreaRequest):Observable<ApiRespone>{
    return this.http.post<ApiRespone>(`${this.url}/api/v1/areas`, request);
  }

  deleteArea(idarea: number): Observable<ApiRespone> {
    return this.http.delete<ApiRespone>(`${this.url}/api/v1/areas/${idarea}`);
  }

  updateArea(request: AreaRequest, idarea: number): Observable<ApiRespone> {
    return this.http.put<ApiRespone>(this.url + '/api/v1/areas/' + idarea, request);
  }
}
