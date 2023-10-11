import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentoService } from '../../@core/data/documento.service';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { Subscription } from 'rxjs';
import { GestorDocumentalService } from '../../@core/utils/gestor-documental.service';
import { MenuService } from '../../@core/data/menu.service';
import { PopUpManager } from '../../managers/popUpManager';

@Component({
  selector: 'ngx-ver-certificacion',
  templateUrl: './ver-certificacion.component.html',
  styleUrls: ['./ver-certificacion.component.scss'],
})
export class VerCertificacionComponent implements OnInit {

  @Output() volverFiltro: EventEmitter<Boolean>;
  @Input() dataContrato: any = [];
  objeto: string;
  cedula: string;
  numeroContrato: string;
  subscription: Subscription;
  nombre: string;
  datosCertficiaciones: any[] = [];
  codigoDocumento: string;

  constructor(
    private gestorDocumental: GestorDocumentalService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private menuService: MenuService,
    private pupManager: PopUpManager,
  ) {
    this.volverFiltro = new EventEmitter();
  }

  ngOnInit() {
    this.consultarDatosContrato();
  }

  private getNomreDocumento(tipoCertificacion: string) {
    return 'certificacion_' + this.numeroContrato + '__' + this.cedula + '_' + tipoCertificacion;
  }

  private getNombreCertificaciones(): string {
    const nombres: string[] = [];
    const permisoContractual = !!this.menuService.getAccion('Ver certificación contractual');
    const permisoCumplimiento = !!this.menuService.getAccion('Ver certificación cumplimiento');

    if (permisoContractual) {
      nombres.push(this.getNomreDocumento('contractual'));
    }

    if (permisoCumplimiento) {
      nombres.push(this.getNomreDocumento('cumplimiento'));
    }

    if (!nombres.length) {
      return '';
    }

    return 'Nombre' + (nombres.length === 1 ? '' : '__in') + ':' + nombres.join('|');

  }

  private getCertificacionesCreadas() {
    const nombres = this.getNombreCertificaciones();
    if (nombres === '') {
      return;
    }

    this.documentoService
      .get('documento/?limit=-1&query=Activo:true,' + nombres)
      .subscribe((data: any) => {
        if (!data || !data.length || !Object.keys(data[0]).length) {
          this.openWindow('El contrato número ' + this.numeroContrato + ' No contiene Certificaciones');
          this.regresarFiltro();
        } else {
          this.datosCertficiaciones = data;
        }
      });
  }

  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  eliminarCertifacion(contrato: any) {
    contrato.Activo = false;
    this.documentoService.put('documento', contrato).subscribe((data) => { });
    const Swal = require('sweetalert2');
    Swal.fire({
      icon: 'error',
      title: 'EXITO',
      text: 'La certificación ha sido eliminada con exitó',
    });

    this.getCertificacionesCreadas();
  }

  descargarCertificacion(contrato: any) {

    const anObject = {
      Id: contrato.Enlace,
      key: 'prueba',
    };

    const serv = this.gestorDocumental.getByUUID(contrato.Enlace);

    /* const serv = this.nuxeoService.getDocumentoOne$(
      anObject,
      this.documentoService
    ); */

    (this.subscription = serv.subscribe((response) => {
      this.download(response, '', 1000, 1000);
    })),
      (error_service) => {
        this.pupManager.showErrorAlert(error_service.message);
        this.regresarFiltro();
      };
  }

  download(url, title, w, h) {
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    window.open(
      url,
      title,
      'toolbar=no,' +
      'location=no, directories=no, status=no, menubar=no,' +
      'scrollbars=no, resizable=no, copyhistory=no, ' +
      'width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left,
    );
    this.subscription.unsubscribe();
  }

  buscarId() {
    this.documentoService
      .get('documento/?query=Enlace:' + this.codigoDocumento)
      .subscribe((data: any) => {
        if (Object.keys(data[0]).length !== 0) {
          this.datosCertficiaciones = data;
        } else {
          this.openWindow('El id' + this.numeroContrato + ' No contiene Certificaciones asociadas');
        }
      });
  }

  consultarDatosContrato() {
    this.evaluacionMidService
      .get(
        'datosContrato?NumContrato=' +
        this.dataContrato[0].ContratoSuscrito +
        '&VigenciaContrato=' +
        this.dataContrato[0].Vigencia,
      )
      .subscribe((res_contrato) => {
        this.objeto = res_contrato.Data[0].contrato_general.ObjetoContrato;
        this.cedula = res_contrato.Data[0].informacion_proveedor.NumDocumento;
        this.nombre = res_contrato.Data[0].informacion_proveedor.NomProveedor;
        this.numeroContrato = res_contrato.Data[0].contrato_general.ContratoSuscrito[0].NumeroContratoSuscrito;

        this.getCertificacionesCreadas();
      }),
      (error_service) => {
        this.pupManager.showErrorAlert(error_service.message);
        this.regresarFiltro();
      };
  }

  openWindow(mensaje) {
    const Swal = require('sweetalert2');
    Swal.fire({
      icon: 'error',
      title: 'ERROR',
      text: mensaje,
    });
  }
}
