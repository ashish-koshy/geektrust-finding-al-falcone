import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResultParameters } from './enums';

@Injectable({
  providedIn: 'root'
})
export class ResultGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const params = route.params;
    const activateResult 
      = typeof params[ResultParameters.success] !== 'undefined' && 
          typeof params[ResultParameters.planetFound] !== 'undefined'
    return activateResult;
  }
}
