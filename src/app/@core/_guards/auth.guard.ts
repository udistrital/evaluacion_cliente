import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { ImplicitAutenticationService } from '../utils/implicit_autentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  rol: any;
  user: any;
  userService: any;
  constructor(private router: Router, private autenticacion: ImplicitAutenticationService) { }

  canActivate(
    route?: ActivatedRouteSnapshot,
    state?: RouterStateSnapshot,
  ) {
    this.autenticacion.user$.subscribe((data: any) => {
      const { user, userService } = data;
      this.user = user;
      this.userService = userService;
    })
    return this.validacion();
    // return valid;
  }

  validacion(): boolean {
    let valid: boolean = false;
    let payload: any;
    if (this.user.role !== undefined) {
      payload = this.user;
    } else {
      payload = this.userService;
    }
    if (payload && payload.role) {
      for (let i = 0; i < payload.role.length; i++) {
        if (payload.role[i] === 'ORDENADOR_DEL_GASTO') {
          this.rol = payload.role[i];
          valid = true;
          break;
        }
      }
      if (this.rol != 'ORDENADOR_DEL_GASTO') {
        for (let i = 0; i < payload.role.length; i++) {
          if (
            payload.role[i] === 'SUPERVISOR' ||
            payload.role[i] === 'ASISTENTE_JURIDICA' ||
            payload.role[i] === 'ASISTENTE_COMPRAS' ||
            payload.role[i] === 'OPS' ||
            payload.role[i] === 'CONTRATISTA'
          ) {
            this.rol = payload.role[i];
            valid = true;
            break;
          }
        }
      }
    }
    return valid;
  }

  rolActual(): any {
    console.info('El rol que retorna es: ', this.rol);
    return this.rol;
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //     return this.canActivate(route, state);
  // }
}
