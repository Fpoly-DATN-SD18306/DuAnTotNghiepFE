
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { ApiRespone } from '../../entity/api-respone';
import { Observable } from 'rxjs';
import { voucherRequest } from '../../entity/request/voucher-request';

@Injectable({
  providedIn: 'root'
})
export class VourcherService {

  url = ApiConfigService.apiUrlPromotion;
  constructor(private http : HttpClient) { }
  postVoucher(voucherRequest : voucherRequest):Observable<ApiRespone>{
    const data = new FormData();
    data.append('namePromotion',voucherRequest.namePromotion)
    data.append('startDate',voucherRequest.startDate.toString())
    data.append('endDate',voucherRequest.endDate.toString())
    data.append('description',voucherRequest.description)
    data.append('discount',voucherRequest.discount.toString())
    console.log(voucherRequest.namePromotion);
    
    return this.http.post<ApiRespone>(this.url,data)

  }
  putVoucher(voucherRequest : voucherRequest,idVoucher :Number):Observable<ApiRespone>{
    
    const data = new FormData();
    data.append('namePromotion',voucherRequest.namePromotion)
    data.append('startDate',voucherRequest.startDate.toString())
    data.append('endDate',voucherRequest.endDate.toString())
    data.append('description',voucherRequest.description)
    data.append('discount',voucherRequest.discount.toString())
    console.log(voucherRequest.namePromotion);
    // const putUrl = `${this.url}+ '/api/v1/promotions'`;
    console.log(idVoucher);
    console.log(data.get('namePromotion'))
    return this.http.put<ApiRespone>(this.url +'/' +idVoucher,data);

  }
  deleteVoucher(id: number): Observable<ApiRespone> {
    const url = `${this.url}/${id}`;
    return this.http.delete<ApiRespone>(url);
  }

  filterVoucher(theKeyword: string,thePage: number, thePageSize: number): Observable<ApiRespone> {
    
    // let idVoucher = theVoucherId ? `&idPromotion=${theVoucherId}` : '';
    let nameVoucher = theKeyword ? `&namePromotion=${theKeyword}` : '';
    // console.log(theVoucherId);
    
    const searchUrl = `${this.url}/filter?${nameVoucher}&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl);
    return this.http.get<ApiRespone>(searchUrl);
  }
}

