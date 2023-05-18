import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ImplicitAutenticationService } from '../utils/implicit_autentication.service';
import { MenuService } from '../data/menu.service';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  rol: any;
  user: any;
  userService: any;
  constructor(
    private router: Router,
    private autenticacion: ImplicitAutenticationService,
    private menu: MenuService,
    private pUpManager: PopUpManager
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const allowed =!!this.menu.getRoute(state.url)
    if (!allowed) {
      this.pUpManager.showErrorAlert('No tiene permisos');
    }
    
    this.setRol();
    return allowed;
  }

  setRol() {
    this.autenticacion.user$.subscribe((data: any) => {
      const { user, userService } = data;
      this.user = user;
      this.userService = userService;
      this.validacion();
    });
  }

  validacion(): boolean {
    let payload: any;
    if (this.user && this.user.role) {
      payload = this.user;
    } else if (this.userService) {
      payload = this.userService;
    }

    if (payload && payload.role && payload.role.length) {
      const rolOrdenador = 'ORDENADOR_DEL_GASTO';
      this.rol = payload.role.find(r => r === rolOrdenador);
      if (this.rol != rolOrdenador) {
        for (let i = 0; i < payload.role.length; i++) {
          if (
            payload.role[i] === 'SUPERVISOR' ||
            payload.role[i] === 'ASISTENTE_JURIDICA' ||
            payload.role[i] === 'ASISTENTE_COMPRAS' ||
            payload.role[i] === 'OPS' ||
            payload.role[i] === 'CONTRATISTA'
          ) {
            this.rol = payload.role[i];
            break;
          }
        }
      }
    }

    return !!this.rol;
  }

  rolActual(): any {
    return this.rol;
  }

}
