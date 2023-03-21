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
  review_btn: boolean[] = [];
  evaluadoresArray: string[] = [];
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
          this.evaluadoresArray = [];
          this.review_btn = [];
        } else if (response.Data === undefined) {
          this.json = {};
          this.evaluadoresArray = [];
          this.review_btn = [];
          if (Object.keys(response[0]).length === 0) {
            this.CargarUltimaPlantilla();
          }
        } else if (Object.keys(response.Data[0]).length === 0) {
          this.json = {};
          this.evaluadoresArray = [];
          this.review_btn = [];
          this.CargarUltimaPlantilla();
        } else if (response.length !== 0 && Object.keys(response.Data[0]).length !== 0) {
          this.json = JSON.parse(response.Data[0].ResultadoEvaluacion);
          this.evaluadoresArray = [];
          this.review_btn = [];
          if (this.json.evaluadores != undefined) {
            this.evaluadoresArray = this.json.evaluadores;
            for (let i = 0; i < this.evaluadoresArray.length; i++) {
              this.review_btn.push(true);
            }
          }
          this.evaRealizada = true;
        }
      });
  }

  CargarUltimaPlantilla() {
    this.evaRealizada = false;
    this.evaluacionMidService.get('plantilla').subscribe((res) => {
      this.json = res.Data;
    }, (error_service) => {
      this.openWindow(error_service['body'][1]['Error'], 'Alerta');
    });
  }

  realizarEvaluacion() {
    this.evaluacionCompleta = true;
    if (this.json.ValorFinal < 0) {
      this.openWindow('Error en el valor total de la evaluación, es menor de cero.', 'Alerta');
    } else if (this.json.ValorFinal > 100) {
      this.openWindow('Error en el valor total de la evaluación, es mayor a 100', 'Alerta');
    } else {
      this.json.evaluadores = this.evaluadoresArray;
      if(this.review_btn.some(disabled => disabled == false)) {
        this.openWindow('Alguno de los evaluadores no se ha guardado', 'Alerta');
        this.evaluacionCompleta = false;
      }
      if(this.evaluadoresArray.some(nombre => nombre == "")) {
        this.openWindow('Falta el nombre de alguno de los evaluadores', 'Alerta');
        this.evaluacionCompleta = false;
      }
      for (let i = 0; i < this.json.Secciones.length; i++) {
        for (let k = 0; k < this.json.Secciones[i].Seccion_hija_id.length; k++) {
          if (this.json.Secciones[i].Seccion_hija_id[k]['Item'][0].Tamano !== 12 && this.json.Secciones[i].Seccion_hija_id[k]['Item'][0].Tamano !== 13) {
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
        this.openWindow('Aun no se ha completado la evaluación', 'Alerta');
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

  agregarEvaluador() {
    this.evaluadoresArray.push("");
    this.review_btn.push(false);
  }

  asignarEvaluador(evaluador: any, i: number) {

    var index = this.evaluadoresArray.indexOf(evaluador);
    if (index == -1) {
      this.evaluadoresArray[i] = evaluador;
      this.openWindow("Evaluador agregado!", "");
    } else {
      this.openWindow("El evaluador ya fue agregado!", "Alerta");
    }
    this.review_btn[i] = true;
  }

  eliminarEvaluador(evaluador: any, i: number) {
    var index = this.evaluadoresArray.indexOf(evaluador);
    if (index != -1) {
      this.evaluadoresArray.splice(i, 1);
      this.review_btn.splice(i, 1);
    }
  }

  deshabilitarBoton(i: number) {
    this.review_btn[i] = false;
  }

  openWindow(mensaje, titulo) {
    this.windowService.open(
      this.contentTemplate,
      { title: titulo, context: { text: mensaje } },
    );
  }

}
