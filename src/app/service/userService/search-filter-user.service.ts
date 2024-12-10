import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Foods } from '../../entity/food/foods';
import { FoodCategory } from '../../entity/category/food-category';
import { ApiConfigService } from '../ApiConfigService';
import { ApiRespone } from '../../entity/api-respone';
import { Users } from '../../entity/user/users';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterUserService {
  private baseUrl = ApiConfigService.apiUsers;
  url = ApiConfigService.apiUrl;
  
  header = new HttpHeaders(
    {"Authorization":"Bearer " +  localStorage.getItem("jwt")}
  )
  
  constructor(private httpClient: HttpClient) { }
  getUserPage(thePage: number, thePageSize: number): Observable<ApiRespone> {
    return this.httpClient.get<ApiRespone>(`${this.url + "/api/v1/users"}?page=${thePage}&size=${thePageSize}`,{headers:this.header});
  }

  filterUser(theUserName: string, theFullname: string, theIsAdmin: string, theIsChangedPass: string, thePage: number, thePageSize: number): Observable<ApiRespone> {
    let isAdmin = theIsAdmin === '123' ? "" : '&isAdmin=' + theIsAdmin;
    let username = theUserName ? `&username=${theUserName}` : ''; 
    let fullname = theFullname ? `&fullname=${theFullname}` : '';
    let isChangedPass = theIsChangedPass === '123' ? "" : '&isChangedPass=' + theIsChangedPass;
    
    const searchUrl = `${this.baseUrl}/filter?${username}${fullname}${isAdmin}${isChangedPass}&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl);
    return this.httpClient.get<ApiRespone>(searchUrl,{headers:this.header});
  }

}


