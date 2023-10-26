import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { RequestManager } from '../../managers/requestManager';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  }),
};

const path = environment.EVALUACIONCRUD_SERVICE;


@Injectable({
  providedIn: 'root',
})
export class EvaluacioncrudService {

  private evaluacionRealizada = new BehaviorSubject([]);
  public evaluacionRealizada$ = this.evaluacionRealizada.asObservable();

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('EVALUACIONCRUD_SERVICE');
  }
  get(endpoint) {
    this.requestManager.setPath('EVALUACIONCRUD_SERVICE');
    return this.requestManager.get(endpoint);
  }
  post(endpoint, element) {
    this.requestManager.setPath('EVALUACIONCRUD_SERVICE');
    return this.requestManager.post(endpoint, element);
  }
  put(endpoint, element) {
    this.requestManager.setPath('EVALUACIONCRUD_SERVICE');
    return this.requestManager.put(endpoint, element);
  }
  delete(endpoint, element) {
    this.requestManager.setPath('EVALUACIONCRUD_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }

  getEvaluacionByContratoVigencia(contrato, vigencia) {
    const payload = 'evaluacion?query=ContratoSuscrito:' + contrato + ',Vigencia:' + vigencia;
    return this.get(payload);
  }

  getResultadoByContratoVigencia(contrato, vigencia) {
    const payload = 'resultado_evaluacion?query=Activo:true,IdEvaluacion__ContratoSuscrito:' + contrato + ',IdEvaluacion__Vigencia:' + vigencia;
    return this.get(payload);
  }
}
