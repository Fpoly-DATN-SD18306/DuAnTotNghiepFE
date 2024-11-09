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
  private baseUrl = ApiConfigService.apiFoods
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
