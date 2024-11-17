import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  public static apiUrlSocket ="http://192.168.0.193:8080" ;
  public static apiUrl ="http://192.168.0.193:8080" ;
  public static apiUrlPromotion ="http://192.168.0.193:8080/api/v1/promotions" ;
  public static apiFoods ="http://192.168.0.193:8080/api/v1/foods";
 public static apiUrlimg ="http://192.168.0.193:8080/images/";

}

