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
  url = ApiConfigService.apiUrl; 
  constructor(private httpClient: HttpClient) { }
  getBookPage(thePage: number, thePageSize: number): Observable<GetResponseFood> {
    return this.httpClient.get<GetResponseFood>(`${this.url+"/api/foodEntities"}?page=${thePage}&size=${thePageSize}`);
  }

  getFood(theFoodId: number): Observable<Foods> {
    const bookUrl = `${this.url+"/api/foodEntities"}/${theFoodId}`;
    return this.httpClient.get<Foods>(bookUrl);
  }

  getBookCategories(): Observable<FoodCategory[]> {
    return this.httpClient.get<GetResponseBookCategory>(this.url+"/api/categoryFoodEntities").pipe(map(response => response._embedded.booksCategory));
  }

  
  getBookListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseFood> {
    const categoryUrl = `${this.url}/api/foodEntities/search/findByCategoryIdCategory?categoryId=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseFood>(categoryUrl);
  }

  searchFood(thePage: number, thePageSize: number,theKeyword: string): Observable<GetResponseFood> {
    const searchUrl = `${this.url}/api/foodEntities/search/findByNameFoodContaining?namefood=${theKeyword}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseFood>(searchUrl);
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