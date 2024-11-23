import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';
import { userRequest } from '../../entity/request/user-request';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = ApiConfigService.apiUrl;
  constructor(private http : HttpClient) { }

  header = new HttpHeaders(
    {"Authorization":"Bearer " +  localStorage.getItem("jwt")}
  )
  
  getAllList():Observable<ApiRespone>{
    return this.http.get<ApiRespone>(this.url+"/api/v1/users",{headers:this.header});
  }
  
  getById(idUser : String):Observable<ApiRespone>{
    
    return this.http.get<ApiRespone>(this.url+"/api/v1/users/"+idUser,{headers:this.header});
  }

  postUser(formData: FormData): Observable<ApiRespone> {
    return this.http.post<ApiRespone>(this.url + "/api/v1/users", formData,{headers:this.header});
  }
  
  putUser(formData: FormData, idUser: String): Observable<ApiRespone> {
    return this.http.put<ApiRespone>(`${this.url}/api/v1/users/${idUser}`, formData,{headers:this.header});
}
}

