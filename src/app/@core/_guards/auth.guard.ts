import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  rol : any;
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
          if ( (payload.role[i] === 'ORDENADOR_DEL_GASTO') || (payload.role[i] === 'SUPERVISOR') || (payload.role[i] === 'CONTRATISTA')) {
            this.rol = payload.role[i];
            
            
              valid = true;
              break;
          }
      }
    }
    return valid;
  }

  rolActual():any {
    const id_token = window.localStorage.getItem('id_token').split('.');
    const payload = JSON.parse(atob(id_token[1]));
    if (payload && payload.role) {
      for ( let i = 0; i < payload.role.length; i++) {
          if ( (payload.role[i] === 'ORDENADOR_DEL_GASTO') || (payload.role[i] === 'SUPERVISOR')|| (payload.role[i] === 'CONTRATISTA')) {
            return payload.role[i];
            
            
              
             
          }
      }
    }


  }
    

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //     return this.canActivate(route, state);
  // }

}
