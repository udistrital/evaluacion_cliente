import { Component, TemplateRef, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { ImplicitAutenticationService } from '../../@core/utils/implicit_autentication.service';
import { AuthGuard } from '../../@core/_guards/auth.guard';
import { UserService } from '../../@core/data/user.service';
import { MenuService } from '../../@core/data/menu.service';


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

  vigencias = ['2016', '2017', '2018', '2019', '2020', '2021'];

  rolUsuario: any;

  identificacion_proveedor: any;
  numero_contrato: any;
  vigencia: any;
  autentication_data: any;
  documento: any;

  constructor(
    private windowService: NbWindowService,
    private evaluacionMidService: EvaluacionmidService,
    private authService: ImplicitAutenticationService,
    private authGuard: AuthGuard,
    private userService: UserService,
    private menuService: MenuService,
  ) {
    this.dataResponse = new EventEmitter();
  }

  ngOnInit() {
  }

  filtro() {

    this.autentication_data = this.authService.getPayload();
    this.rolUsuario = this.authGuard.rolActual();
    if (this.rolUsuario === 'ORDENADOR_DEL_GASTO') {
      this.documento = '0';
    } else {
      this.documento = this.autentication_data.documento;
    }
    if (((isNaN(this.numero_contrato) === true) || (this.numero_contrato === 0) || (this.numero_contrato === null)
      || (this.numero_contrato === undefined)) && ((isNaN(this.identificacion_proveedor) === true) || (this.identificacion_proveedor === 0)
        || (this.identificacion_proveedor === null) || (this.identificacion_proveedor === undefined))) {
      this.openWindow('Debe ingresar almenos una Identificación de proveedor o un número de contrato');
      console.info('Rol', this.rolUsuario);
      console.log('Documento', this.documento);
    } else {
      this.checkSupervisor();
    }
  }

  private getFiltroTipo(): string {
    const requiereFiltro = this.filtroTipo &&
      !this.menuService.getAccion('Evaluar todo tipo') &&
      !!this.menuService.getAccion('Evaluar solo compras');

    if (!requiereFiltro) {
      return '';
    }

    return '&TipoContrato=Orden de Compra';
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

}
