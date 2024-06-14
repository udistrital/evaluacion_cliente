import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { InformacionDVE } from "../../@core/data/models/certificacionesDve/informacionDVE";
import { IntensidadHorariaDVE } from "../../@core/data/models/certificacionesDve/intensidadHorariaDVE";
import { environment } from "../../../environments/environment";
import { PeticionCertificacionesDve } from "../../@core/data/models/certificacionesDve/peticionCertificacionesDve";
import { InformacionCertificacionDve } from "./../../@core/data/models/certificacionesDve/informacionCertificacionDve";
import { catchError, map } from 'rxjs/operators';
import { error } from "console";


@Injectable({
  providedIn: "root",
})
export class CertificacionDveService {
  private urlCertificacionesDve =
    environment.EVALUACIONMID_SERVICE + "informacion_certificacion_dve";

  constructor(private http: HttpClient) {}

  getDataCertificactionDve(
    petticion: PeticionCertificacionesDve
  ): Observable<InformacionCertificacionDve> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http
      .post<any>(this.urlCertificacionesDve, petticion, { headers: headers })
      .pipe(
        map((response) => {
          if (response.Data) {
            const informacionDVE = new InformacionDVE(
              response.Data.informacion_dve.activo,
              response.Data.informacion_dve.nombre_docente,
              response.Data.informacion_dve.numero_documento,
              response.Data.informacion_dve.nivel_academico,
              response.Data.informacion_dve.facultad,
              response.Data.informacion_dve.proyecto_curricular
            );

            const intensidades = response.Data.intensidad_horaria.map((intensidad: any)=>{
             new IntensidadHorariaDVE(
                    intensidad.ano,
                    intensidad.periodo,
                    intensidad.nombre_asignatura,
                    intensidad.horas_semanales,
                    intensidad.numero_semanas,
                    intensidad.horas_semestrales,
                    intensidad.salario_docente
                );
            });
            return new InformacionCertificacionDve(informacionDVE, intensidades);
          }else{
            throw "Error al consultar datos"
          }
        }),
        catchError(e=>{
            console.log("se produjo un error en la peticion" +e);
            return throwError(()=>e);
        })
      
      );
  }


  getDataCertificactionDveTest(){
    let  informacionDVE = new InformacionDVE("false", "PEDRO AUGUSTO ANGEL ORTEGA", "88194457","PREGRADO","ingenieria", "proyecto1");
    let randomNum = Math.floor(Math.random() * 10) + 1;
    let  intensidad: IntensidadHorariaDVE[]=[];
   
    for(let i=0;i<randomNum ; i++){
        let intensidadH = new IntensidadHorariaDVE("20"+i, i.toString(), "Sistemas", i.toString(), randomNum.toString(), i.toString(), "200000");
    intensidad.push(intensidadH);
    }
     return  new InformacionCertificacionDve(informacionDVE, intensidad);


    
  }

}

