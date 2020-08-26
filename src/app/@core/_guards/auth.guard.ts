import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
      return Observable.of(this.validacion());
      // return valid;
  }

  validacion(): boolean {
    let valid: boolean =  false;
    const id_token = window.localStorage.getItem('id_token').split('.');
    const payload = JSON.parse(atob(id_token[1]));
    if (payload && payload.role) {
      for ( let i = 0; i < payload.role.length; i++) {
          if ( (payload.role[i] === 'ORDENADOR_DEL_GASTO') || (payload.role[i] === 'SUPERVISOR')) {
              valid = true;
              break;
          }
      }
    }
    return valid;
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //     return this.canActivate(route, state);
  // }

}
