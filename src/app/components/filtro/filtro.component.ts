import { Component, TemplateRef, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { ImplicitAutenticationService } from '../../@core/utils/implicit_autentication.service';


@Component({
  selector: 'ngx-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {

  @Output() dataResponse: EventEmitter<any>;

  @ViewChild('contentTemplate', { read: false }) contentTemplate: TemplateRef<any>;

  vigencias = ['2016', '2017', '2018', '2019', '2020'];

  identificacion_proveedor: any;
  numero_contrato: any;
  vigencia: any;
  autentication_data: any;
  documento: any;

  constructor(
    private windowService: NbWindowService,
    private evaluacionMidService: EvaluacionmidService,
    private authService: ImplicitAutenticationService,
  ) {
    this.dataResponse = new EventEmitter();
  }

  ngOnInit() {
  }

  filtro() {

    this.autentication_data = this.authService.getPayload();
    this.documento = this.autentication_data.documento;
    if (((isNaN(this.numero_contrato) === true) || (this.numero_contrato === 0) || (this.numero_contrato === null)
      || (this.numero_contrato === undefined)) && ((isNaN(this.identificacion_proveedor) === true) || (this.identificacion_proveedor === 0)
        || (this.identificacion_proveedor === null) || (this.identificacion_proveedor === undefined))) {
      this.openWindow('Debe ingresar almenos una Identificación de proveedor o un número de contrato');
    } else {
      this.RealizarPeticion();
    }
  }

  RealizarPeticion() {
    if ((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null)
      && (this.numero_contrato === undefined || this.numero_contrato === null) && (this.vigencia === undefined)) {
      this.evaluacionMidService.get('filtroProveedor?ProvID=' + this.identificacion_proveedor + '&SupID=' + String(this.documento))
        .subscribe((res) => {
          if (res !== null) {
            this.dataResponse.emit(res);
          }
        }, (error_service) => {
          this.openWindow(error_service['body'][1]['Error']);
          this.dataResponse.emit([]);
        });
    } else {
      if ((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null)
        && (this.numero_contrato === undefined || this.numero_contrato === null) && (this.vigencia !== undefined)) {
        this.evaluacionMidService.get('filtroProveedor?ProvID=' + this.identificacion_proveedor + '&Vigencia=' + this.vigencia
         + '&SupID=' + String(this.documento))
          .subscribe((res) => {
            if (res !== null) {
              this.dataResponse.emit(res);
            }
          }, (error_service) => {
            this.openWindow(error_service['body'][1]['Error']);
            this.dataResponse.emit([]);
          });
      } else {
        if ((this.identificacion_proveedor === undefined || this.identificacion_proveedor === null)
          && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia === undefined)) {
          this.evaluacionMidService.get('filtroContrato?NumContrato=' + this.numero_contrato + '&Vigencia=0&SupID=' + String(this.documento))
            .subscribe((res) => {
              if (res !== null) {
                this.dataResponse.emit(res);
              }
            }, (error_service) => {
              this.openWindow(error_service['body'][1]['Error']);
              this.dataResponse.emit([]);
            });
        } else {
          if ((this.identificacion_proveedor === undefined || this.identificacion_proveedor === null)
            && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia !== undefined)) {
            this.evaluacionMidService.get('filtroContrato?NumContrato=' + this.numero_contrato + '&Vigencia='
              + String(this.vigencia) + '&SupID=' + String(this.documento)).subscribe((res) => {
                if (res !== null) {
                  this.dataResponse.emit(res);
                }
              }, (error_service) => {
                this.openWindow(error_service['body'][1]['Error']);
                this.dataResponse.emit([]);
              });
          } else {
            if (((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null))
              && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia === undefined)) {
              this.evaluacionMidService.get('filtroMixto?IdentProv=' + this.identificacion_proveedor + '&NumContrato='
                + this.numero_contrato + '&Vigencia=0&SupID=' + String(this.documento)).subscribe((res) => {
                  if (res !== null) {
                    this.dataResponse.emit(res);
                  }
                }, (error_service) => {
                  this.openWindow(error_service['body'][1]['Error']);
                  this.dataResponse.emit([]);
                });
            } else {
              if (((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null))
                && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia !== undefined)) {
                this.evaluacionMidService.get('filtroMixto?IdentProv=' + this.identificacion_proveedor + '&NumContrato='
                  + this.numero_contrato + '&Vigencia=' + String(this.vigencia) + '&SupID=' + String(this.documento)).subscribe((res) => {
                    if (res !== null) {
                      this.dataResponse.emit(res);
                    }
                  }, (error_service) => {
                    this.openWindow(error_service['body'][1]['Error']);
                    this.dataResponse.emit([]);
                  });
              }
            }
          }
        }
      }
    }
  }

  openWindow(mensaje) {
    this.windowService.open(
      this.contentTemplate,
      { title: 'Alerta', context: { text: mensaje } },
    );
  }

  limpiarfiltro() {
    this.identificacion_proveedor = null;
    this.numero_contrato = null;
    this.vigencia = undefined;
    this.dataResponse.emit([]);
  }

}
