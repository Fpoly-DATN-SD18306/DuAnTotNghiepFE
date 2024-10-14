import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  public static apiUrl ="http://localhost:8080" ;
  public static apiUrlimg ="http://192.168.1.15:8080/images/" ;

}
