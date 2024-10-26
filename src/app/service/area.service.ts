import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRespone } from '../entity/api-respone';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient) { }

  getAllAreas():Observable<ApiRespone>{
    return this.http.get<ApiRespone>(`${this.url}/api/v1/areas`)
  }
}
