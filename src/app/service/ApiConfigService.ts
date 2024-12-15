import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  public static apiUrl =environment.apiUrl ;
  public static apiUrlimg ="" ;
  public static apiFoods=ApiConfigService.apiUrl+'/api/v1/foods';
  public static apiUsers=ApiConfigService.apiUrl+'/api/v1/users';
  public static apiUrlPromotion =ApiConfigService.apiUrl+"/api/v1/promotions" ;
  public static apiUrlReport =ApiConfigService.apiUrl+"/api/v1/reports" ;


}

