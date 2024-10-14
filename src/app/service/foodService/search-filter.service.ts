import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Foods } from '../../entity/food/foods';
import { FoodCategory } from '../../entity/category/food-category';
import { ApiConfigService } from '../ApiConfigService';
import { ApiRespone } from '../../entity/api-respone';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {
  private baseUrl = 'http://192.168.1.15:8080/api/v1/foods';
  url = ApiConfigService.apiUrl;
  constructor(private httpClient: HttpClient) { }
  getFoodPage(thePage: number, thePageSize: number): Observable<ApiRespone> {
    return this.httpClient.get<ApiRespone>(`${this.url + "/api/v1/foods"}?page=${thePage}&size=${thePageSize}`);
  }

  filterFood(theKeyword: string, theCategoryId: string, theSelling: string, thePage: number, thePageSize: number): Observable<ApiRespone> {
    let isSelling = theSelling === '123' ? "" : '&isSelling=' + theSelling;
    let idCategory = theCategoryId ? `&idCategory=${theCategoryId}` : '';
    let nameFood = theKeyword ? `&nameFood=${theKeyword}` : '';
    console.log(nameFood);
    
    const searchUrl = `${this.baseUrl}/filter?${nameFood}${idCategory}${isSelling}&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl);
    return this.httpClient.get<ApiRespone>(searchUrl);
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
// getFood(theFoodId: number): Observable<Foods> {
//   const bookUrl = `${this.url+"/api/foods"}/${theFoodId}`;
//   return this.httpClient.get<Foods>(bookUrl);
// }

// getFoodCategories(): Observable<FoodCategory[]> {
//   return this.httpClient.get<GetResponseBookCategory>(this.url+"/api/categoryFoodEntities").pipe(map(response => response._embedded.booksCategory));
// }
// getFoodList(): Observable<Foods[]> {
//   return this.httpClient.get<GetResponseFood>(this.baseUrl).pipe(map(response => response._embedded.foodEntities));
// }
//  let isSelling = theSelling !== '' && theSelling !== false ? `&isSelling=${theSelling}` : '';
// let isSelling = theSelling !== '' && theSelling !== false ? `&isSelling=${encodeURIComponent(theSelling)}` : '';
// let idCategory = theCategoryId ===null?'':'&idCategory='+theCategoryId;
// isSelling = theSelling ?'&isSelling='+theSelling:'';