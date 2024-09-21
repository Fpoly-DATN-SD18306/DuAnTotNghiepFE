import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './ApiConfigService';
import { ApiRespone } from '../entity/api-respone';
import { Observable } from 'rxjs';
import { foodRequest } from '../entity/request/food-request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = ApiConfigService.apiUrl;
  constructor(private http : HttpClient) { }

  getAllCate():Observable<ApiRespone>{
    return this.http.get<ApiRespone>(this.url+"/api/v1/categories");
  }
 

}
