
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { ApiRespone } from '../../entity/api-respone';
import { Observable } from 'rxjs';
import { promotionRequest } from '../../entity/request/promotion-request';

@Injectable({
  providedIn: 'root'
})
export class VourcherService {

  url = ApiConfigService.apiUrlPromotion;
  constructor(private http : HttpClient) { }
  postVoucher(voucherRequest : promotionRequest):Observable<ApiRespone>{
    const data = new FormData();
    data.append('namePromotion',voucherRequest.namePromotion)
    data.append('startDate',voucherRequest.startDate.toString())
    data.append('endDate',voucherRequest.endDate.toString())
    data.append('description',voucherRequest.description)
    data.append('discount',voucherRequest.discount.toString())
    data.append('isIncreasePrice', voucherRequest.isIncreasePrice.toString());
    console.log(voucherRequest.endDate);
    console.log(voucherRequest.startDate);
    
    return this.http.post<ApiRespone>(this.url,data)

  }
  putVoucher(voucherRequest : promotionRequest,idVoucher :Number):Observable<ApiRespone>{
    
    const data = new FormData();
    data.append('namePromotion',voucherRequest.namePromotion)
    data.append('startDate',voucherRequest.startDate.toString())
    data.append('endDate',voucherRequest.endDate.toString())
    data.append('description',voucherRequest.description)
    data.append('discount',voucherRequest.discount.toString())
     data.append('isIncreasePrice', voucherRequest.isIncreasePrice.toString());
    console.log(voucherRequest.namePromotion);
    // const putUrl = `${this.url}+ '/api/v1/promotions'`;
    console.log(idVoucher);
    console.log(data.get('namePromotion'))
    return this.http.put<ApiRespone>(this.url +'/' +idVoucher,data);
    console.log(voucherRequest.endDate);
    console.log(voucherRequest.startDate);
  }
  deleteVoucher(idVoucher: number): Observable<ApiRespone> {

    return this.http.delete<ApiRespone>(this.url +'/' +idVoucher);
  }

  filterVoucher(theKeyword: string,theStatus: string,theIsIncreasePrice:string,theSortField:string,theSortDirection:string, thePage: number, thePageSize: number): Observable<ApiRespone> {
    let nameVoucher = theKeyword ? `&namePromotion=${theKeyword}` : '';
    let status = theStatus ? `&status=${theStatus}` : '';
    let isIncreasePrice = theIsIncreasePrice === '123' ?'':  '&isIncreasePrice=' + theIsIncreasePrice;
    let sortField = `&sortBy=${theSortField}`;
    let sortDirection =`&orderBy=${theSortDirection}`;
    const searchUrl = `${this.url}/filter?${nameVoucher}${status}${isIncreasePrice}${sortField}${sortDirection}&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl);
    return this.http.get<ApiRespone>(searchUrl);
  }
}

