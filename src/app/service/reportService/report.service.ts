import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { ReportRequest } from '../../entity/request/report-request';
import { Observable } from 'rxjs';
import { ApiRespone } from '../../entity/api-respone';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  url = ApiConfigService.apiUrlReport;
  constructor(private http : HttpClient) { }
  filterReport(theStartDate:string, theEndDate:string): Observable<ApiRespone> {
    let startDate = theStartDate ? `&startDate=${theStartDate}` : '';
    let endDate = theEndDate ? `&endDate=${theEndDate}` : '';

    const searchUrl = `${this.url}/filter?${startDate}${endDate}`;
    return this.http.get<ApiRespone>(searchUrl);
  }
  filterChart(theGroupBy:string): Observable<ApiRespone>{
    let groupBy = theGroupBy ? `&groupBy=${theGroupBy}` : '';
    const searchUrl = `${this.url}/filterchart?${groupBy}`;
    return this.http.get<ApiRespone>(searchUrl);

  }
}
