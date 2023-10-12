import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from './../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  }),
};

const path = environment.CONF_MENU_SERVICE;

@Injectable()
export class MenuService {

  private permisos: any[];

  constructor(private http: HttpClient) {
    this.permisos = [];
  }

  get(endpoint) {
    return this.http.get(path + endpoint, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  post(endpoint, element) {
    return this.http.post(path + endpoint, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  put(endpoint, element) {
    return this.http.put(path + endpoint + '/' + element.Id, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  delete(endpoint, element) {
    return this.http.delete(path + endpoint + '/' + element.Id, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  public setPermisos(configuraciones: any) {
    this.permisos = configuraciones;
  }

  public getRoute(accion: string): any {
    return this.findRoute(this.permisos, accion);
  }

  findRoute(menu: any[], option: string) {
    return menu.find(opt => (opt.Url === option) ||
      (opt.Opciones && opt.Opciones.length && this.findRoute(opt.Opciones, option)));
  }

  getAccion(accion: string): any {
    return this.findAccion(this.permisos, accion);
  }

  findAccion(menu: any[], option: string) {
    return menu.find(opt => (opt.TipoOpcion === 'Acción' && opt.Nombre === option) ||
      (opt.Opciones && opt.Opciones.length && this.findAccion(opt.Opciones, option)));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError({
      status: error.status,
      message: 'Something bad happened; please try again later.',
    });
  }
}
