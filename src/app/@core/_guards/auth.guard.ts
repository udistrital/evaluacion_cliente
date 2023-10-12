import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MenuService } from '../data/menu.service';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private menu: MenuService,
    private pUpManager: PopUpManager,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const allowed = !!this.menu.getRoute(state.url);
    if (!allowed) {
      this.pUpManager.showErrorAlert('No tiene permisos');
    }

    return allowed;
  }

}
