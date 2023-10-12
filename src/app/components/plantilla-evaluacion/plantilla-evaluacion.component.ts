import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { NbWindowService } from '@nebular/theme';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../@core/data/user.service';

@Component({
  selector: 'ngx-plantilla-evaluacion',
  templateUrl: './plantilla-evaluacion.component.html',
  styleUrls: ['./plantilla-evaluacion.component.scss'],
})
export class PlantillaEvaluacionComponent implements OnInit {

  @Input() realizar: any;
  @Input() evaluacionPrevia: any;
  @ViewChild('contentTemplate', { read: false }) contentTemplate: TemplateRef<any>;
  @Output() jsonEvaluacion: EventEmitter<any>;

  json: any = {};
  evaluacionCompleta: boolean;
  evaRealizada: boolean;
  evaluadores: any[];
  evaluadoresForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private evaluacionMidService: EvaluacionmidService,
    private userService: UserService,
    private windowService: NbWindowService,
  ) {
    this.evaluadoresForm = this.fb.group({ evaluadores: this.fb.array([]) });
    this.jsonEvaluacion = new EventEmitter();
    this.evaluacionCompleta = true;
  }

  ngOnInit(): void {
    if (this.evaluacionPrevia) {
      this.json = JSON.parse(this.evaluacionPrevia);
      this.evaRealizada = true;
      if (this.json.evaluadores && this.json.evaluadores.length) {
        this.evaluadoresForm = this.fb.group({ evaluadores: this.fb.array([]) });
        for (const ev of this.json.evaluadores) {
          this.userService.getAllInfoPersonaNatural('?query=Id:' + ev)
            .subscribe(res => {
              if (res && res.length) {
                const evaluador = this.fb.group({
                  evaluador: {
                    value: res[0],
                    disabled: !this.realizar,
                  },
                });
                this.evaluadoresForm_.push(evaluador);
                this.cambiosEvaluador(evaluador.get('evaluador').valueChanges);
              }
            });
        }
      }
    } else {
      this.CargarUltimaPlantilla();
    }
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
      return;
    } else if (this.json.ValorFinal > 100) {
      this.openWindow('Error en el valor total de la evaluación, es mayor a 100', 'Alerta');
      return;
    } else {
      const evaluadores = this.evaluadoresForm.value.evaluadores.map(ev => ev.evaluador);
      if (evaluadores.some(eva => !eva.Id)) {
        this.openWindow('Los evaluadores no se han seleccionado correctamente.', 'Alerta');
        this.evaluacionCompleta = false;
        return;
      }

      const firmantes = this.evaluadoresForm.value.evaluadores.map(ev => ev.evaluador).map(ev => ({
        nombre: ev.PrimerNombre.concat(' ', ev.SegundoNombre).concat(' ', ev.PrimerApellido).concat(' ', ev.SegundoApellido),
        cargo: ev.Cargo,
        tipoId: ev.TipoDocumento.Abreviatura,
        identificacion: ev.Id,
      }));

      this.json.evaluadores = evaluadores.map(ev => ev.Id);
      this.json.firmantes = firmantes;
      for (let i = 0; i < this.json.Secciones.length; i++) {
        for (let k = 0; k < this.json.Secciones[i].Seccion_hija_id.length; k++) {
          if (this.json.Secciones[i].Seccion_hija_id[k]['Item'][0].Tamano !== 12 &&
            this.json.Secciones[i].Seccion_hija_id[k]['Item'][0].Tamano !== 13) {
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

  private cambiosEvaluador(valueChanges: Observable<any>) {
    valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val: any) => this.loadEvaluadores(val)),
      ).subscribe((response: any) => {
        this.evaluadores = response.queryOptions &&
          response.queryOptions.length &&
          response.queryOptions[0].Id ? response.queryOptions : [];
      });
  }

  private loadEvaluadores(text: string) {
    const payload = '?fields=Id,Cargo,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido,TipoDocumento&limit=0&query=Id__icontains:';
    const queryOptions$ = typeof (text) === 'string' && text.length > 3 ?
      this.userService.getAllInfoPersonaNatural(payload + text.replace(/\D/g, '')) :
      new Observable((obs) => { obs.next([]); });
    return combineLatest([queryOptions$]).pipe(
      map(([queryOptions_$]) => ({
        queryOptions: queryOptions_$,
      })),
    );
  }

  public muestraTercero(contr): string {
    return contr.Id ? contr.Id : '';
  }

  public agregarEvaluador() {
    const evaluador = this.fb.group({
      evaluador: [''],
    });
    this.evaluadoresForm_.push(evaluador);
    this.cambiosEvaluador(evaluador.get('evaluador').valueChanges);
  }

  get evaluadoresForm_() {
    return this.evaluadoresForm.get('evaluadores') as FormArray;
  }

  eliminarEvaluador(evaluador: any, i: number) {
    this.evaluadoresForm_.removeAt(evaluador);
  }

  openWindow(mensaje, titulo) {
    this.windowService.open(
      this.contentTemplate,
      { title: titulo, context: { text: mensaje } },
    );
  }

}
