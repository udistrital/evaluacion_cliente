import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { DocumentoService } from '../../@core/data/documento.service';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { Subscription } from 'rxjs';
import { GestorDocumentalService } from '../../@core/utils/gestor-documental.service';
import { PopUpManager } from '../../managers/popUpManager';

@Component({
  selector: 'ngx-ver-certificacion',
  templateUrl: './ver-certificacion.component.html',
  styleUrls: ['./ver-certificacion.component.scss'],
})
export class VerCertificacionComponent implements OnInit {
  @ViewChild('contentTemplate', { read: false })
  contentTemplate: TemplateRef<any>;

  @Output() volverFiltro: EventEmitter<Boolean>;
  @Input() dataContrato: any = [];
  @Input() rol: string = '';
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
    private pupManager: PopUpManager,
  ) {
    this.volverFiltro = new EventEmitter();
  }

  ngOnInit() {
    this.consultarDatosContrato();
  }

  consultarIdCertificaciones() {
    // console.log('rol',this.rol)
    const err = 'El contrato número ' + this.numeroContrato + ' no contiene Certificaciones';
    const endpoint = 'documento/';
    const payload = '?limit=-1&query=Activo:true,Nombre';
    const nombre = 'certificacion_' + this.numeroContrato + '__' + this.cedula;

    if (this.rol === 'CONTRATISTA' || this.rol === 'ASISTENTE_JURIDICA' || this.rol === 'ASISTENTE_COMPRAS') {
      var tipoCertificacion = '_contractual';
      if (this.rol === 'ASISTENTE_COMPRAS') {
        tipoCertificacion = '_cumplimiento';
      }

      this.documentoService
        .get(
          endpoint +
          payload + ':' +
          nombre +
          tipoCertificacion,
        )
        .subscribe((data: any) => {
          if (data && data.length && Object.keys(data[0]).length) {
            this.datosCertficiaciones = data;
          } else {
            this.pupManager.showAlertWithButton('info', 'Alerta', err, 'GLOBAL.aceptar');
            this.regresarFiltro();
          }
        });
    } else if (this.rol === 'ORDENADOR_DEL_GASTO' || this.rol === 'OPS') {
      // console.log('este es el rol',this.rol)
      this.documentoService
        .get(
          endpoint +
          payload + '__in:' +
          nombre + '_contractual|' +
          nombre + '_cumplimiento',
        )
        .subscribe((data: any) => {
          if (data && data.length && Object.keys(data[0]).length) {
            this.datosCertficiaciones = data;
          } else {
            this.pupManager.showAlertWithButton('info', 'Alerta', err, 'GLOBAL.aceptar');
            this.regresarFiltro();
          }
        });
    }
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

    this.consultarIdCertificaciones();
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
      // console.log('respuesta 1', response);

      // console.log('respuesta', response['prueba']);

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
        // console.log('datos de el id',data)
        if (Object.keys(data[0]).length !== 0) {
          this.datosCertficiaciones = data;
        } else {
          const err = 'El contrato número ' + this.numeroContrato + ' contiene Certificaciones';
          this.pupManager.showAlertWithButton('info', 'Alerta', err, 'GLOBAL.aceptar');
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
        // console.log('aca esta el contrato', res_contrato);
        this.objeto = res_contrato.Data[0].contrato_general.ObjetoContrato;

        this.cedula = res_contrato.Data[0].informacion_proveedor.NumDocumento;
        // console.log('aca esta la cedula',this.cedula);
        this.nombre = res_contrato.Data[0].informacion_proveedor.NomProveedor;
        this.numeroContrato =
          res_contrato.Data[0].contrato_general.ContratoSuscrito[0].NumeroContratoSuscrito;

        this.consultarIdCertificaciones();
      }),
      (error_service) => {
        this.pupManager.showErrorAlert(error_service.message);
        this.regresarFiltro();
      };
  }

}
