import { Component, TemplateRef, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { UserService } from '../../@core/data/user.service';
import { MenuService } from '../../@core/data/menu.service';

const CONTRATOS_COMPRAS: string[] = ['Orden de Compra', 'Orden de Servicios'];

@Component({
  selector: 'ngx-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {

  @Output() dataResponse: EventEmitter<any>;
  @Input() nombreTitulo: String;
  @Input() filtroSupervisor: boolean = false;
  @Input() filtroTipo: boolean = false;
  @ViewChild('contentTemplate', { read: false }) contentTemplate: TemplateRef<any>;

  vigencias: string[] = [];
  identificacion_proveedor: any;
  numero_contrato: any;
  vigencia: any;

  constructor(
    private evaluacionMidService: EvaluacionmidService,
    private userService: UserService,
    private menuService: MenuService,
  ) {
    this.dataResponse = new EventEmitter();
  }

  ngOnInit() {
    this.listarVigencias();
  }

  filtro() {
    if (((isNaN(this.numero_contrato) === true) || (this.numero_contrato === 0) || (this.numero_contrato === null)
      || (this.numero_contrato === undefined)) && ((isNaN(this.identificacion_proveedor) === true) || (this.identificacion_proveedor === 0)
        || (this.identificacion_proveedor === null) || (this.identificacion_proveedor === undefined))) {
      this.openWindow('Debe ingresar almenos una Identificación de proveedor o un número de contrato');
    } else {
      this.checkSupervisor();
    }
  }

  private getFiltroTipo(): string {
    const requiereFiltro = this.filtroTipo &&
      !!this.menuService.getAccion('Certificar compras') !== !!this.menuService.getAccion('Certificar no compras');

    if (!requiereFiltro) {
      return '';
    }

    const not = !!this.menuService.getAccion('Certificar no compras') ? 'not' : '';
    return '&TipoContrato=' + not + 'in:' + CONTRATOS_COMPRAS.join('|');
  }

  private checkSupervisor(): void {
    if (!this.filtroSupervisor) {
      this.RealizarPeticion('', this.getFiltroTipo());
      return;
    }

    const documento = this.userService.getDocumentoUser();
    if (documento === '') {
      this.openWindow('No se pudo consultar su documento. Contacte Soporte.');
      return;
    }

    this.RealizarPeticion('&Supervisor=' + documento, this.getFiltroTipo());
    return;
  }

  RealizarPeticion(qSupervisor: string = '', qTipo: string = '') {
    if ((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null)
      && (this.numero_contrato === undefined || this.numero_contrato === null) && (this.vigencia === undefined)) {
      this.evaluacionMidService.get('filtroProveedor?ProvID=' + String(this.identificacion_proveedor) + qSupervisor + qTipo)
        .subscribe((res) => {
          // console.log('respuesta del filtro',res);
          if (res.Data !== null) {
            this.dataResponse.emit(res.Data);
          }
        }, (error_service) => {
          this.openWindow(error_service);
          this.dataResponse.emit([]);
        });
    } else {
      if ((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null)
        && (this.numero_contrato === undefined || this.numero_contrato === null) && (this.vigencia !== undefined)) {
        this.evaluacionMidService.get('filtroMixto?IdentProv=' + this.identificacion_proveedor +
          '&NumContrato=0&Vigencia=' + String(this.vigencia) + qSupervisor + qTipo)
          .subscribe((res) => {
            if (res.Data !== null) {
              this.dataResponse.emit(res.Data);
            }
          }, (error_service) => {
            this.openWindow(error_service);
            this.dataResponse.emit([]);
          });
      } else {
        if ((this.identificacion_proveedor === undefined || this.identificacion_proveedor === null)
          && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia === undefined)) {
          this.evaluacionMidService.get('filtroContrato?NumContrato=' + String(this.numero_contrato) + '&Vigencia=0' + qSupervisor + qTipo)
            .subscribe((res) => {
              if (res.Data !== null) {
                this.dataResponse.emit(res.Data);
              }
            }, (error_service) => {
              this.openWindow(error_service);
              this.dataResponse.emit([]);
            });
        } else {
          if ((this.identificacion_proveedor === undefined || this.identificacion_proveedor === null)
            && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia !== undefined)) {
            this.evaluacionMidService.get('filtroContrato?NumContrato=' + String(this.numero_contrato) + '&Vigencia='
              + String(this.vigencia) + qSupervisor + qTipo).subscribe((res) => {
                if (res.Data !== null) {
                  this.dataResponse.emit(res.Data);
                }
              }, (error_service) => {
                this.openWindow(error_service);
                this.dataResponse.emit([]);
              });
          } else {
            if (((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null))
              && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia === undefined)) {
              this.evaluacionMidService.get('filtroMixto?IdentProv=' + this.identificacion_proveedor + '&NumContrato='
                + this.numero_contrato + '&Vigencia=0' + qSupervisor + qTipo).subscribe((res) => {
                  if (res.Data !== null) {

                    this.dataResponse.emit(res.Data);
                  }
                }, (error_service) => {
                  this.openWindow(error_service);
                  this.dataResponse.emit([]);
                });
            } else {
              if (((this.identificacion_proveedor !== undefined) && (this.identificacion_proveedor != null))
                && (this.numero_contrato !== undefined && this.numero_contrato != null) && (this.vigencia !== undefined)) {
                this.evaluacionMidService.get('filtroMixto?IdentProv=' + this.identificacion_proveedor + '&NumContrato='
                  + this.numero_contrato + '&Vigencia=' + String(this.vigencia) + qSupervisor + qTipo).subscribe((res) => {
                    if (res.Data !== null) {
                      this.dataResponse.emit(res.Data);
                    }
                  }, (error_service) => {
                    this.openWindow(error_service);
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
    const Swal = require('sweetalert2');
    Swal.fire({
      icon: 'error',
      title: 'ERROR',
      text: mensaje,
    });
  }

  limpiarfiltro() {
    this.identificacion_proveedor = null;
    this.numero_contrato = null;
    this.vigencia = undefined;
    this.dataResponse.emit([]);
  }


  private listarVigencias() {
    const currentYear: number = new Date().getFullYear();
    for (let year = currentYear; year >= 2017; year--) {
      this.vigencias.push(year.toString());
    }
  }

}
