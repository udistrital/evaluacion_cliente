import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { RequestManager } from '../../managers/requestManager';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
      'Accept': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
  }),
};

const path = environment.NOVEDADES_SERVICE;

@Injectable({
  providedIn: 'root'
})
export class NovedadesService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('NOVEDADES_SERVICE');
  }
  get(endpoint) {
    this.requestManager.setPath('NOVEDADES_SERVICE');
    return this.requestManager.get(endpoint);
  }
  post(endpoint, element) {
    this.requestManager.setPath('NOVEDADES_SERVICE');
    return this.requestManager.post(endpoint, element);
  }
  put(endpoint, element) {
    this.requestManager.setPath('NOVEDADES_SERVICE');
    return this.requestManager.put(endpoint, element);
  }
  delete(endpoint, element) {
    this.requestManager.setPath('NOVEDADES_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}
