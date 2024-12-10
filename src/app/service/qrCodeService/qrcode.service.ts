import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiRespone } from '../../entity/api-respone';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {
  url = ApiConfigService.apiUrl;
  constructor(private http: HttpClient) { }

  header = new HttpHeaders(
    {"Authorization":"Bearer " +  localStorage.getItem("jwt")}
  )

  getAllQr():Observable<ApiRespone>{
    return this.http.get<ApiRespone>(`${this.url}/api/QRcode`,{headers:this.header})
  }

  createQrCode(idTable: number): Observable<ApiRespone> {
    return this.http.post<ApiRespone>(`${this.url}/api/QRcode`, { idTable },{headers:this.header});
  }
  
  updateQrCode(idTable: number): Observable<ApiRespone>{
    return this.http.put<ApiRespone>(`${this.url}/api/QRcode`, { idTable },{headers:this.header});
  }
}
