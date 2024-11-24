import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  public static apiUrl ="http://192.168.2.18:8080" ;
  public static apiUrlimg ="http://192.168.2.18:8080/images/" ;
  public static apiFoods='http://192.168.2.18:8080/api/v1/foods'
}