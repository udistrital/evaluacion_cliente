import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { IntensidadHorariaDVE } from "../../@core/data/models/certificacionesDve/intensidadHorariaDVE";
import { environment } from "../../../environments/environment";
import { InformacionCertificacionDve } from "./../../@core/data/models/certificacionesDve/informacionCertificacionDve";
import { catchError, map, retry, tap } from "rxjs/operators";
import { Response } from "@angular/http";
import { InformacionDVE } from "./../../@core/data/models/certificacionesDve/informacionDVE";
import { RequestManager } from "../../managers/requestManager";
import { UserService } from "../../@core/data/user.service";

@Injectable({
  providedIn: "root",
})
export class CertificacionDveService {
  private urlCertificacionesDve = `${environment.EVALUACIONMID_SERVICE}informacion_certificacion_dve`;

  constructor(
    private http: HttpClient,
    private requestManeger: RequestManager,
    private userService: UserService
  ) {
    this.requestManeger.setPath("EVALUACIONMID_SERVICE");
  }
  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  private getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  post(endpoint: string, body: any) {
    this.requestManeger.setPath("EVALUACIONMID_SERVICE");
    return this.requestManeger.post(endpoint, body);
  }

  getDataCertificactionDve(peticion: any): Observable<any> {
    const respuesta = this.http
      .post<any>(this.urlCertificacionesDve, peticion, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response) => {
          return {
            activo: response.Data.informacion_dve.activo,
            nombreDocente: response.Data.informacion_dve.nombre_docente,
            numeroDocumento: response.Data.informacion_dve.numero_documento,
            nivelAcademico: response.Data.informacion_dve.numero_documento,
            facultad: response.Data.informacion_dve.facultad,
            proyectoCurricular:response.Data.informacion_dve.proyecto_curricular,
            categoria: response.Data.informacion_dve.categoria,
            dedicacion: response.Data.informacion_dve.dedicacion,
            ultimoPagoDve: response.Data.informacion_dve.ultimo_pago_dve,
            intensidadHoraria: response.Data.intensidad_horaria.map(
              (intensidad: any) => {
                return {
                  anio: intensidad.Año,
                  periodo: intensidad.Periodo,
                  tipoVinculacion: intensidad.TipoVinculacion,
                  numeroSemanas: intensidad.NumeroSemanas,
                  horaSemanales: intensidad.HorasSemanales,
                  resoluciones: intensidad.Resoluciones.map(
                    (resolucion: any) => {
                      return {
                        proyectoCurricular: resolucion.ProyectoCurricular,
                        asignaturas: resolucion.Asignaturas,
                        fechaInicio: resolucion.FechaInicio,
                        fechaFin: resolucion.FechaFin,
                        horasSemanales: resolucion.HorasSemanales,
                        numeroSemanas: resolucion.NumeroSemanas,
                        horasSemestre: resolucion.HorasSemestre,
                        tipoVinculacion: resolucion.TipoVinculacion,
                        categoria: resolucion.Titular,
                        valor: resolucion.Valor,
                        nivelAcademico: resolucion.NivelAcademico,
                        facultad: resolucion.Facultad,
                        resolucion: resolucion.Resolucion,
                      };
                    }
                  ),
                };
              }
            ),
          };
        })
      );

    return respuesta;
  }

  getDataCertificactionDveTest(): Observable<any> {
    const informacionDVE: InformacionDVE = {
      activo: "false",
      nombreDocente: "LUIS ENRIQUE CORREA BECERRA",
      numeroDocumento: "79108100",
      nivelAcademico: "PREGRADO",
      facultad: "FACULTAD DE INGENIERIA",
      proyectoCurricular: "INGENIERIA ELECTRONICA",
      categoria: "Titular",
      dedicacion: "HCP",
      ultimoPagoDve: 1504440.0,
      intensidadHoraria: [],
    };

    const intensidadHoraria: IntensidadHorariaDVE[] = [
      {
        anio: "2024",
        periodo: "3",
        tipoVinculacion: "HCP",
        numeroSemanas: "38",
        horaSemanales: "32",
        resoluciones: [
          {
            proyectoCurricular: "INGENIERIA ELECTRONICA",
            asignaturas: "ECONOMÍA, INGENIERÍA ECONÓMICA",
            fechaInicio: new Date("2024-11-15T05:00:00Z"),
            fechaFin: new Date("2024-12-21T05:00:00Z"),
            horasSemanales: 12,
            numeroSemanas: 5,
            horasSemestre: 60,
            tipoVinculacion: "HCP",
            categoria: "Titular",
            valor: "1504440.0",
            nivelAcademico: "PREGRADO",
            facultad: "FACULTAD DE INGENIERIA",
            resolucion: "243",
          },
          {
            proyectoCurricular: "INGENIERIA ELECTRICA",
            asignaturas: "ECONOMÍA",
            fechaInicio: new Date("2024-11-15T05:00:00Z"),
            fechaFin: new Date("2024-12-21T05:00:00Z"),
            horasSemanales: 4,
            numeroSemanas: 5,
            horasSemestre: 20,
            tipoVinculacion: "HCP",
            categoria: "Titular",
            valor: "501480.0",
            nivelAcademico: "PREGRADO",
            facultad: "FACULTAD DE INGENIERIA",
            resolucion: "243",
          },
        ],
      },
      {
        anio: "2024",
        periodo: "1",
        tipoVinculacion: "HCP",
        numeroSemanas: "36",
        horaSemanales: "16",
        resoluciones: [
          {
            proyectoCurricular: "INGENIERIA ELECTRONICA",
            asignaturas: "ECONOMÍA, INGENIERÍA ECONÓMICA",
            fechaInicio: new Date("2024-02-01T05:00:00Z"),
            fechaFin: new Date("2024-06-08T05:00:00Z"),
            horasSemanales: 12,
            numeroSemanas: 18,
            horasSemestre: 216,
            tipoVinculacion: "HCP",
            categoria: "Titular",
            valor: "1356840.0",
            nivelAcademico: "PREGRADO",
            facultad: "FACULTAD DE INGENIERIA",
            resolucion: "028",
          },
          {
            proyectoCurricular: "INGENIERIA ELECTRICA",
            asignaturas: "ECONOMÍA",
            fechaInicio: new Date("2024-02-01T05:00:00Z"),
            fechaFin: new Date("2024-06-08T05:00:00Z"),
            horasSemanales: 4,
            numeroSemanas: 18,
            horasSemestre: 72,
            tipoVinculacion: "HCP",
            categoria: "Titular",
            valor: "452280.0",
            nivelAcademico: "PREGRADO",
            facultad: "FACULTAD DE INGENIERIA",
            resolucion: "028",
          },
        ],
      },
    ];

    informacionDVE.intensidadHoraria = intensidadHoraria;

    return of(informacionDVE);
  }

  async obtenerNombreDocente(): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        this.userService.getPersonaNaturalAmazon().subscribe({
          next: (response: any) => {
            if (response && response.length > 0) {
              const data = response[0];
              const nombreCompleto =
                data.PrimerNombre +
                " " +
                data.PrimerApellido +
                " " +
                data.SegundoApellido;
              resolve(nombreCompleto);
            }
          },
        });
      });
    } catch (error) {
      console.error("Error al consultar el nombre del docente");
    }
  }
}
