import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { EvaluacioncrudService } from '../../@core/data/evaluacioncrud.service';
import { NbWindowService } from '@nebular/theme';


@Component({
  selector: 'ngx-plantilla-evaluacion',
  templateUrl: './plantilla-evaluacion.component.html',
  styleUrls: ['./plantilla-evaluacion.component.scss'],
})
export class PlantillaEvaluacionComponent {

  @Input() realizar: any;
  @ViewChild('contentTemplate', { read: false }) contentTemplate: TemplateRef<any>;
  @Output() jsonEvaluacion: EventEmitter<any>;
  pipeprueba = 'algo';
  json: any = {};
  evaluacionCompleta: boolean;
  evaRealizada: boolean;
  constructor(
    private evaluacionMidService: EvaluacionmidService,
    private evaluacioncrudService: EvaluacioncrudService,
    private windowService: NbWindowService,
  ) {
    this.jsonEvaluacion = new EventEmitter();
    this.evaluacionCompleta = true;
    this.evaluacioncrudService.evaluacionRealizada$
      .subscribe((response: any) => {
        if (response.length === 0) {
          this.json = {};
        } else if (Object.keys(response[0]).length === 0) {
          this.CargarUltimaPlantilla();
        } else if (response.length !== 0 && Object.keys(response[0]).length !== 0) {
          this.json = JSON.parse(response[0].ResultadoEvaluacion);
          this.evaRealizada = true;
        }
      });
  }

  CargarUltimaPlantilla() {
    this.evaRealizada = false;
    this.evaluacionMidService.get('plantilla').subscribe((res) => {
      this.json = res;
    }, (error_service) => {
      this.openWindow(error_service['body'][1]['Error']);
    });
  }

  realizarEvaluacion() {
    this.evaluacionCompleta = true;
    if (this.json.ValorFinal < 0) {
      this.openWindow('Error en el valor total de la evaluación, es menor de cero.');
    } else if (this.json.ValorFinal > 100) {
      this.openWindow('Error en el valor total de la evaluación, es mayor a 100');
    } else {
      for (let i = 0; i < this.json.Secciones.length; i++) {
        for (let k = 0; k < this.json.Secciones[i].Seccion_hija_id.length; k++) {
          if (this.json.Secciones[i].Seccion_hija_id[k]['Item'][0].Tamano !== 12) {
            if (this.json.Secciones[i].Seccion_hija_id[k]['Condicion'].length > 0) {
              if (this.json.Secciones[i].Seccion_hija_id[k - 1]['Item'][2].Valor.Nombre ===
                this.json.Secciones[i].Seccion_hija_id[k]['Condicion'][0]['Nombre']) {
                if (this.json.Secciones[i].Seccion_hija_id[k]['Item'][2].Valor.Valor === undefined) {
                  this.evaluacionCompleta = false;
                }
              }
            } else if (this.json.Secciones[i].Seccion_hija_id[k]['Item'][2].Valor.Valor === undefined) {
              this.evaluacionCompleta = false;
            }
          }
        }
      }
      if (this.evaluacionCompleta === false) {
        this.openWindow('Aun no se ha completado la evaluación');
      } else if (this.evaluacionCompleta === true) {
        this.jsonEvaluacion.emit(this.json);
      }
    }
  }

  filterChanged(i: any) {
    this.json.ValorFinal = 0;
    this.json.Secciones[i].ValorSeccion = 0;
    for (let k = 0; k < this.json.Secciones[i].Seccion_hija_id.length; k++) {
      if (this.json.Secciones[i].Seccion_hija_id[k]['Item'][2].Valor.Valor !== undefined) {
        if (this.json.Secciones[i].Seccion_hija_id[k]['Condicion'].length > 0) {
          if (this.json.Secciones[i].Seccion_hija_id[k - 1]['Item'][2].Valor.Nombre ===
            this.json.Secciones[i].Seccion_hija_id[k]['Condicion'][0]['Nombre']) {
            this.json.Secciones[i].ValorSeccion += this.json.Secciones[i].Seccion_hija_id[k]['Item'][2].Valor.Valor;
          } else {
            this.json.Secciones[i].Seccion_hija_id[k]['Item'][2].Valor = '';
          }
        } else {
          this.json.Secciones[i].ValorSeccion += this.json.Secciones[i].Seccion_hija_id[k]['Item'][2].Valor.Valor;
        }
      }
    }
    for (let k = 0; k < this.json.Secciones.length; k++) {
      if (this.json.Secciones[k].ValorSeccion !== undefined) {
        this.json.ValorFinal += this.json.Secciones[k].ValorSeccion;
      }
    }
  }

  openWindow(mensaje) {
    this.windowService.open(
      this.contentTemplate,
      { title: 'Alerta', context: { text: mensaje } },
    );
  }
}
