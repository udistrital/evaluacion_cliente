import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { IntensidadHorariaDVE } from "../../@core/data/models/certificacionesDve/intensidadHorariaDVE";
import { environment } from "../../../environments/environment";
import { InformacionCertificacionDve } from "./../../@core/data/models/certificacionesDve/informacionCertificacionDve";
import { catchError, map, retry, tap } from "rxjs/operators";
import { Response } from "@angular/http";
import { InformacionDVE } from "./../../@core/data/models/certificacionesDve/informacionDVE";

@Injectable({
  providedIn: "root",
})
export class CertificacionDveService {
  private urlCertificacionesDve = `${environment.EVALUACIONMID_SERVICE}informacion_certificacion_dve`;

  constructor(private http: HttpClient) {}
  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  private getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }
  getDataCertificactionDve(peticion: any): Observable<any> {
    return this.http
      .post<any>(this.urlCertificacionesDve, peticion, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response) => {
          if (response.Data) {
            const infoDev = new InformacionDVE(
              response.Data.informacion_dve.activo,
              response.Data.informacion_dve.nombre_docente,
              response.Data.informacion_dve.numero_documento,
              response.Data.informacion_dve.nivel_academico,
              response.Data.informacion_dve.facultad,
              response.Data.informacion_dve.proyecto_curricular
            );
            let intensidadList = response.Data.intensidad_horaria.map(
              (item: any) => {
                return new IntensidadHorariaDVE(
                  item.ano,
                  item.periodo,
                  item.nombre_asignatura,
                  item.horas_semanales,
                  item.numero_semanas,
                  item.horas_semestrales,
                  item.salario_docente
                );
              }
            );
            return new InformacionCertificacionDve(infoDev, intensidadList);
          }
        })
      );
  }

  getDataCertificactionDveTest() {
    let informacionDVE = new InformacionDVE(
      "false",
      "PEDRO AUGUSTO ANGEL ORTEGA",
      "88194457",
      "PREGRADO",
      "ingenieria",
      "proyecto1"
    );
    let randomNum = Math.floor(Math.random() * 30) + 1;
    let intensidad: IntensidadHorariaDVE[] = [];

    for (let i = 10; i < randomNum; i++) {
      let intensidadH = new IntensidadHorariaDVE(
        "20" + i,
        i.toString(),
        "Sistemas",
        i.toString(),
        randomNum.toString(),
        i.toString(),
        "200000"
      );
      intensidad.push(intensidadH);
    }
    return new InformacionCertificacionDve(informacionDVE, intensidad);
  }
}