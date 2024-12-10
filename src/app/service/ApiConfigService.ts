import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  public static apiUrl ="http://192.168.2.18:8080" ;
  public static apiUrlimg ="http://192.168.2.18:8080/images/" ;
  public static apiFoods='http://192.168.2.18:8080/api/v1/foods';
  public static apiUsers='http://192.168.2.18:8080/api/v1/users';
  public static apiUrlPromotion ="http://192.168.2.18:8080/api/v1/promotions" ;
  public static apiUrlReport ="http://192.168.2.18:8080/api/v1/reports" ;

  // public static apiUrl ="http://192.168.1.7:8080"
  // public static apiUrlimg ="http://192.168.1.7:8080/images/"
  // public static apiFoods='http://192.168.1.7:8080/api/v1/foods'
  // public static apiUsers='http://192.168.1.7:8080/api/v1/users'
  // public static apiUrlPromotion ="http://192.168.1.7:8080/api/v1/promotions"
}

