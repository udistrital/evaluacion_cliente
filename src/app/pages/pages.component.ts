import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MenuService } from '../@core/data/menu.service';
import { ImplicitAutenticationService } from '../@core/utils/implicit_autentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';


import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
      <footer></footer>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;
  roles: any;
  rol: string;
  menuLogin: NbMenuItem[] = [];
  dataMenu: any;

  constructor(
    private translate: TranslateService,
    private menuws: MenuService,
    private autenticacion: ImplicitAutenticationService,
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => { // Live reload
    });

  }

  ngOnInit() {
    this.autenticacion.user$.subscribe((data: any) => {
      const id_token = window.localStorage.getItem('id_token').split('.');
      const payload = JSON.parse(atob(id_token[1]));
      const { user, userService } = data;
      let roles: any;
      if (user.role !== undefined) {
        const roleUser = typeof user.role !== 'undefined' ? user.role : [];
        roles = (roleUser).filter((role: any) => (role.indexOf('/') === -1));
      } else {
        const roleUserService = typeof userService.role !== 'undefined' ? userService.role : [];
        roles = (roleUserService).filter((role: any) => (role.indexOf('/') === -1));
      }
      this.getMenu(roles);
    });
  }

  getMenu(roles) {
    this.roles = roles;
    this.menuws.get(this.roles + `/Evaluacion`).subscribe(menuResult => {
      this.menuws.setPermisos(menuResult);
      const menuRespuesta = <any>menuResult;
      this.menuLogin.push({
        title: 'Home',
        icon: 'nb-home',
        link: '/pages/dashboard',
      });
      if (menuRespuesta !== null) {
        for (let i = 0; i < menuRespuesta.length; i++) {
          this.menuLogin.push({
            title: menuRespuesta[i]['Nombre'],
            link: menuRespuesta[i]['Url'],
            icon: 'nb-compose',
          });
        }
      }
      this.menu = this.menuLogin;
    },
      (error: HttpErrorResponse) => {
        this.menu = MENU_ITEMS;
      });
  }
}
