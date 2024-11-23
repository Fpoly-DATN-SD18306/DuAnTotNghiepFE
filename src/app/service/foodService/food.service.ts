import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../ApiConfigService';
import { foodRequest } from '../../entity/request/food-request';
import { ApiRespone } from '../../entity/api-respone';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  url = ApiConfigService.apiUrl;
  constructor(private http : HttpClient) { }

  header = new HttpHeaders(
    {"Authorization":"Bearer " +  localStorage.getItem("jwt")}
  )

  getAllList():Observable<ApiRespone>{
    return this.http.get<ApiRespone>(this.url+"/api/v1/foods",{headers:this.header});
  }

  getByIdCategory(idCategory : number):Observable<ApiRespone>{
    return this.http.get<ApiRespone>(this.url+"/api/v1/foods/category/"+idCategory,{headers:this.header});
  }
  
  getById(idFood : number):Observable<ApiRespone>{
    
    return this.http.get<ApiRespone>(this.url+"/api/v1/foods/"+idFood,{headers:this.header});
  }

  postFood(foodRequest : foodRequest, file : File):Observable<ApiRespone>{
    
    const data = new FormData();
    data.append('nameFood',foodRequest.nameFood)
    data.append('priceFood',foodRequest.priceFood.toString())
    data.append('isSelling',foodRequest.isSelling?'True':'False'),
    data.append('note',foodRequest.note)
    data.append('idCategory',foodRequest.idCategory.toString())
    data.append('file',file)
    data.append('discount',foodRequest.discount.toString())
    
    console.log(foodRequest.isSelling)

    return this.http.post<ApiRespone>(this.url+"/api/v1/foods",data,{headers:this.header})

  }
  putFood(foodRequest : foodRequest, file : File,idFood :Number):Observable<ApiRespone>{
    
    const data = new FormData();
    data.append('nameFood',foodRequest.nameFood)
    data.append('priceFood',foodRequest.priceFood.toString())
    data.append('isSelling',foodRequest.isSelling?'True':'False'),
   
    data.append('note',foodRequest.note)
    data.append('idCategory',foodRequest.idCategory.toString())
    data.append('file',file)
    data.append('discount',foodRequest.discount.toString())

    console.log(foodRequest.isSelling)
 
    return this.http.put<ApiRespone>(this.url+"/api/v1/foods/"+idFood,data,{headers:this.header})

  }
  

}
