import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryFoodEntity } from '../Class/category-food-entity';
@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {
  url = 'http://localhost:8080/api/foodEntities'

  constructor(private http: HttpClient) {}

  getCategory():Observable<CategoryFoodEntity[]>{
    return this.http.get<CategoryFoodEntity[]>(this.url);
  }
}
