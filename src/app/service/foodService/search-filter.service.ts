import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Foods } from '../../entity/food/foods';
import { FoodCategory } from '../../entity/category/food-category';
import { ApiConfigService } from '../ApiConfigService';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {
  private baseUrl = 'http://localhost:8080/api/foodEntities';
  url = ApiConfigService.apiUrl; 
  constructor(private httpClient: HttpClient) { }
  getFoodPage(thePage: number, thePageSize: number): Observable<GetResponseFood> {
    return this.httpClient.get<GetResponseFood>(`${this.url+"/api/foodEntities"}?page=${thePage}&size=${thePageSize}`);
  }

  getFood(theFoodId: number): Observable<Foods> {
    const bookUrl = `${this.url+"/api/foodEntities"}/${theFoodId}`;
    return this.httpClient.get<Foods>(bookUrl);
  }

  getFoodCategories(): Observable<FoodCategory[]> {
    return this.httpClient.get<GetResponseBookCategory>(this.url+"/api/categoryFoodEntities").pipe(map(response => response._embedded.booksCategory));
  }
  getFoodList(): Observable<Foods[]> {
    return this.httpClient.get<GetResponseFood>(this.baseUrl).pipe(map(response => response._embedded.foodEntities));
  }
  
  getFoodListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseFood> {
    const categoryUrl = `${this.baseUrl}/search/findByCategoryIdCategory?idCategory=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseFood>(categoryUrl);
  }
  getFoodListByisSelling(thePage: number, thePageSize: number, theSelling: boolean): Observable<GetResponseFood> {
    const categoryUrl = `${this.baseUrl}/search/findByIsSelling?isSelling=${theSelling}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseFood>(categoryUrl);
  }
  searchFood(thePage: number, thePageSize: number,theKeyword: string): Observable<GetResponseFood> {
    const searchUrl = `${this.baseUrl}/search/findByNameFoodContaining?namefood=${theKeyword}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseFood>(searchUrl);
  }
}
interface GetResponseFood {
  _embedded: {
    foodEntities: Foods[];
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
