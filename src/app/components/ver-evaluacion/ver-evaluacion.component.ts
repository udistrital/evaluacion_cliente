import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { EvaluacioncrudService } from '../../@core/data/evaluacioncrud.service';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { NbWindowService } from '@nebular/theme';
import { DocumentoService } from '../../@core/data/documento.service';
import { GestorDocumentalService } from '../../@core/utils/gestor-documental.service';

@Component({
  selector: 'ngx-ver-evaluacion',
  templateUrl: './ver-evaluacion.component.html',
  styleUrls: ['./ver-evaluacion.component.scss'],
})
export class VerEvaluacionComponent implements OnInit {
  @ViewChild('contentTemplate', { read: false }) contentTemplate: TemplateRef<any>;
  @Input() dataContrato: any = [];
  @Output() volverFiltro: EventEmitter<Boolean>;
  realizar: boolean;
  evaluacionRealizada: any;
  contratoCompleto: any;
  supervisor: any;
  proveedor: any;
  dependencia: String;
  fechaEvaluacion: Date;
  docDefinition: any;
  jsonPDF: any;
  observacionesPdf: string;
  constructor(
    private evaluacionCrudService: EvaluacioncrudService,
    private evaluacionMidService: EvaluacionmidService,
    private windowService: NbWindowService,
    private documentoService: DocumentoService,
    private gestorDocumental: GestorDocumentalService,
  ) {
    this.volverFiltro = new EventEmitter();
    this.evaluacionRealizada = {};
    this.contratoCompleto = {};
    this.supervisor = {};
    this.realizar = true;
    this.proveedor = {};
    this.dependencia = '';
    this.fechaEvaluacion = new Date();
    this.jsonPDF = [];
  }

  ngOnInit() {
    this.consultarDatosContrato();
    this.consultaEvaluacion();
  }

  private consultaEvaluacion() {
    this.evaluacionCrudService.getResultadoByContratoVigencia(this.dataContrato[0].ContratoSuscrito, this.dataContrato[0].Vigencia)
      .subscribe((res_resultado_eva: any) => {
        if (res_resultado_eva && res_resultado_eva.Data && res_resultado_eva.Data.length && Object.keys(res_resultado_eva.Data[0]).length) {
          this.realizar = false;
          this.evaluacionRealizada = res_resultado_eva.Data[0];
          this.fechaEvaluacion = new Date(res_resultado_eva.Data[0].FechaCreacion.substr(0, 16));
        } else {
          this.evaluacionCrudService.getEvaluacionByContratoVigencia(this.dataContrato[0].ContratoSuscrito, this.dataContrato[0].Vigencia)
            .subscribe((res_evaluacion: any) => {
              this.regresarFiltro();
              if (!res_evaluacion || !res_evaluacion.Data || !res_evaluacion.Data.length || !res_evaluacion.Data[0].Id) {
                this.openWindow('El contrato no ha sido evaluado.');
              } else {
                this.openWindow('No se pudo cargar el resultado de la evaluación. Contacte soporte.');
              }
            }, (error_service) => {
              this.openWindow(error_service.message);
            });
        }
      }, (error_service) => {
        this.openWindow(error_service.message);
      });
  }

  // Se consulta los datos del contrato general.
  consultarDatosContrato() {
    this.evaluacionMidService.get('datosContrato?NumContrato=' + this.dataContrato[0].ContratoSuscrito +
      '&VigenciaContrato=' + this.dataContrato[0].Vigencia).subscribe((res_contrato) => {
        this.dependencia = res_contrato.Data[0].dependencia_SIC.ESFDEPENCARGADA;
        this.proveedor = res_contrato.Data[0].informacion_proveedor;
        this.contratoCompleto = res_contrato.Data[0].contrato_general;
        this.supervisor = this.contratoCompleto.Supervisor;
        /*this.administrativaAmazonService.get('supervisor_contrato?query=Documento:' + this.supervisor.Documento
          + ',DependenciaSupervisor:' + this.contratoCompleto.DependenciaSolicitante).subscribe((response) => {
            console.info(response[0].Cargo)
          }), (error_service) => {
          };*/

      }), (error_service) => {
        this.openWindow(error_service.message);
        this.regresarFiltro();
      };
  }

  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  imprimirEvalucion() {
    /* pdfMake.createPdf(this.makePdf2()).download('evaluacion_del_contrato' + this.dataContrato[0].ContratoSuscrito +
      '-' + this.dataContrato[0].Vigencia + '.pdf'); */
    const nombreDoc = 'evaluacion_contrato_' + this.dataContrato[0].ContratoSuscrito +
      '_vig_' + this.dataContrato[0].Vigencia + '_proveedor_' + this.dataContrato[0].IdProveedor;
    this.documentoService.get('documento/?query=Nombre:' + nombreDoc + ',Activo:true&limit=1&fields=Enlace&sortby=FechaCreacion&order=desc')
      .subscribe((response: any[]) => {
        if (Object.keys(response[0]).length > 0) {
          this.gestorDocumental.getByUUID(response[0].Enlace)
            .subscribe((respGD) => {
              this.download(respGD, '', 1000, 1000);
            });
        }
      });
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
  }

  openWindow(mensaje) {
    this.windowService.open(
      this.contentTemplate,
      { title: 'Alerta', context: { text: mensaje } },
    );
  }

  formatDate(date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

}
