import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Foods } from '../entity/food/foods';
import { FoodCategory } from '../entity/category/food-category';

@Injectable({
  providedIn: 'root'
})
export class ServiceFoodAdminService {
  private baseUrl = 'http://localhost:8080/api/foodEntities';
  private categoryUrl = 'http://localhost:8080/api/categoryFoodEntities';  
  constructor(private httpClient: HttpClient) { }
  getBookPage(thePage: number, thePageSize: number): Observable<GetResponseFood> {
    return this.httpClient.get<GetResponseFood>(`${this.baseUrl}?page=${thePage}&size=${thePageSize}`);
  }
  
}
interface GetResponseFood {
  _embedded: {
    books: Foods[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number;
  }
}

interface GetResponseBookCategory {
  _embedded: {
    booksCategory: FoodCategory[];
  }
}