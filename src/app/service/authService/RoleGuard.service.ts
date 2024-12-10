
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../ApiConfigService';
import { HttpClient } from '@angular/common/http';
import { ApiRespone } from '../../entity/api-respone';
import { Observable } from 'rxjs';
import { promotionRequest } from '../../entity/request/promotion-request';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor( private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

      let token = localStorage.getItem("jwt")
      token = token==null?"":token
      if(token==""){
        this.router.navigate(["/login"])
        return false;    
      } 
      let expectedRole:string[] = route.data['expectedRole'];
      let decodeToken: any = jwtDecode(token);
      let roleToken = decodeToken.scope;
      if(expectedRole.indexOf(roleToken)<0){
        this.router.navigate(["/login"])
        return false;    
      }    
    return true;
  }

}

