import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FoodEntity } from '../Class/food-entity';

@Injectable({
  providedIn: 'root'
})
export class FoodEntityServiceService {
  url = 'http://localhost:8080/api/foodEntities'

  constructor(private http: HttpClient) {}


 

  getAllFood():Observable<FoodEntity[]>{
    return this.http.get<FoodEntity[]>(this.url);
  }

  getFoodByIdCategory(id:number):Observable<FoodEntity[]>{
    return this.http.get<FoodEntity[]>(this.url+"/"+id)
  }

  getfoodByIdCategoryAndName(id:number,name:string):Observable<FoodEntity[]>{
    const params = new HttpParams().set('name', name);
    return this.http.get<FoodEntity[]>(this.url+"/find"+"/"+id,{params});
  }

  getfoodByIdCategoryAndNameisSort(id:number,name:string,sort:boolean):Observable<FoodEntity[]>{
    const params = new HttpParams().set('name', name).set('sort',sort );
    return this.http.get<FoodEntity[]>(this.url+"/find"+"/"+id,{params});
  }
}
