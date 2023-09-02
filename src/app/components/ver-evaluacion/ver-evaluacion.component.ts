import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { EvaluacioncrudService } from '../../@core/data/evaluacioncrud.service';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { AdministrativaamazonService } from '../../@core/data/admistrativaamazon.service';
import { NbWindowService } from '@nebular/theme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { IMAGENES } from '../images';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  labelAux: any;
  constructor(
    private evaluacionCrudService: EvaluacioncrudService,
    private evaluacionMidService: EvaluacionmidService,
    private windowService: NbWindowService,
    private administrativaAmazonService: AdministrativaamazonService,
  ) {
    this.volverFiltro = new EventEmitter();
    this.evaluacionRealizada = {};
    this.contratoCompleto = {};
    this.supervisor = {};
    this.realizar = true;
    this.proveedor = {};
    this.dependencia = '';
    this.fechaEvaluacion = new Date();
    this.labelAux = ['\n\n'];
    this.jsonPDF = [];
  }

  ngOnInit() {
    // console.log(this.dataContrato)
    this.realizar = false;
    this.consultarDatosContrato();
    // Se verifica si se ha realizado una evaluación
    this.evaluacionCrudService.get('evaluacion?query=ContratoSuscrito:' + this.dataContrato[0].ContratoSuscrito +
      ',Vigencia:' + this.dataContrato[0].Vigencia).subscribe((res_evaluacion) => {
        if (Object.keys(res_evaluacion.Data[0]).length !== 0) {
          this.evaluacionCrudService.getEvaluacion('resultado_evaluacion?query=IdEvaluacion:' + res_evaluacion.Data[0].Id + ',Activo:true');
          this.evaluacionCrudService.get('resultado_evaluacion?query=IdEvaluacion:' + res_evaluacion.Data[0].Id + ',Activo:true')
            .subscribe((res_resultado_eva) => {
              if (res_resultado_eva !== null) {
                this.evaluacionRealizada = JSON.parse(res_resultado_eva.Data[0].ResultadoEvaluacion);
                this.fechaEvaluacion = new Date(res_resultado_eva.Data[0].FechaCreacion.substr(0, 16));
                this.crearJsonPDF();
              }
            }, (error_service) => {
              this.openWindow(error_service.message);
            });
        } else {
          this.regresarFiltro();
          this.openWindow('El contrato no ha sido evaluado.');
        }
      }, (error_service) => {
        this.openWindow(error_service.message);
      });
  }

  getCalificacion() {
    for (let i = 0; i < this.evaluacionRealizada.Clasificaciones.length; i++) {
      if (this.evaluacionRealizada.ValorFinal >= this.evaluacionRealizada.Clasificaciones[i].LimiteInferior
        && this.evaluacionRealizada.ValorFinal <= this.evaluacionRealizada.Clasificaciones[i].LimiteSuperior) {
        return this.evaluacionRealizada.Clasificaciones[i].Nombre;
      }
    }
  }

  crearJsonPDF() {
    let array: any;
    let bodyTableSeccion: any = [];
    let valorSeccion: any;
    // Se crea el objeto que trae toda la calificación
    for (let i = 1; i < this.evaluacionRealizada.Secciones.length - 1; i++) {
      bodyTableSeccion = [];
      valorSeccion = 0;
      bodyTableSeccion.push([' ', ' ', ' ', { text: 'Valor Asignado', style: 'subtitulo' }]);
      for (let k = 0; k < this.evaluacionRealizada.Secciones[i].Seccion_hija_id.length; k++) {
        if (this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k]['Condicion'].length > 0) {
          if (this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k - 1]['Item'][2].Valor.Nombre ===
            this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k]['Condicion'][0]['Nombre']) {
            bodyTableSeccion.push([this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[0].Valor,
            this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[1].Valor,
            this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[2].Valor.Nombre,
            {
              text: this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[2].Valor.Valor,
              alignment: 'center',
            },
            ]);
            valorSeccion += this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[2].Valor.Valor;
          }
        } else {
          bodyTableSeccion.push([
            this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[0].Valor,
            this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[1].Valor,
            this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[2].Valor.Nombre,
            {
              text: this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[2].Valor.Valor,
              alignment: 'center',
            },
          ]);
          valorSeccion += this.evaluacionRealizada.Secciones[i].Seccion_hija_id[k].Item[2].Valor.Valor;
        }
      }
      bodyTableSeccion.push(['', '',
        { text: 'Puntaje total', style: 'subtitulo' },
        { text: valorSeccion, alignment: 'center' },
      ]);
      array = [[
        { text: this.evaluacionRealizada.Secciones[i].Nombre, style: 'header' },
        {
          style: 'tableSeciones',
          table: {
            widths: [85, '*', 60, 60],
            body: bodyTableSeccion,
          },
          layout: 'noBorders',
        },
      ]];
      this.jsonPDF.push(array);
    }
    this.observacionesPdf = this.evaluacionRealizada.observaciones;
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
    pdfMake.createPdf(this.makePdf2()).download('evaluacion_del_contrato' + this.dataContrato[0].ContratoSuscrito +
      '-' + this.dataContrato[0].Vigencia + '.pdf');
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

  obtenerObservaciones() {
    var obsStruct = {};
    if (this.evaluacionRealizada.observaciones != undefined) {
      this.observacionesPdf = this.evaluacionRealizada.observaciones;
      obsStruct = [
        {
          text: "Observaciones", bold: true, style: 'header',
        },
        {
          text: '\n' + this.evaluacionRealizada.observaciones, style: 'tableSeciones',
        }
      ]
    }
    return obsStruct
  }

  tablaEvaluadores() {
    var evaStruct = [];
    var medidas = [350, 150, 27];
    var tabla = [];
    if (this.evaluacionRealizada.evaluadores != undefined && this.evaluacionRealizada.evaluadores.length != 0) {
      tabla.push(
        [
          { text: 'NOMBRE DEL EVALUADOR', alignment: 'center', bold: true },
          { text: 'FIRMA', alignment: 'center', bold: true }
        ]
      );
      for (var eva in this.evaluacionRealizada.evaluadores) {
        medidas.push(90);
        tabla.push(
          [
            { text: "\n" + this.evaluacionRealizada.evaluadores[eva] + "\n\n" },
            { text: "" }
          ]
        );
      }
      evaStruct = [
        {
          text: "\nEvaluadores\n", bold: true, style: 'header'
        },
        {
          style: 'table',
          table: {
            widths: medidas,
            body: tabla,
          },
        }
      ]
      return evaStruct;
    }
  }

  makePdf2() {
    return {
      ageSize: 'LETTER',
      pageMargins: [40, 130, 40, 60],
      header: {
        margin: [40, 50],
        columns: [
          {
            table: {
              widths: [50, '*', 130, 70],
              body: [
                [
                  { image: 'logo_ud', fit: [43, 80], rowSpan: 3, alignment: 'center', fontSize: 9 },
                  { text: 'EVALUACIÓN Y REEVALUACIÓN DE PROVEEDORES', bold: true, alignment: 'center', fontSize: 9 },
                  { text: 'Código: GC-PR-006-FR-028', fontSize: 9 },
                  { image: 'logo_sigud', fit: [65, 120], margin: [3, 0], rowSpan: 3, alignment: 'center', fontSize: 9 },
                ],
                [' ',
                  { text: 'Macroproceso: Gestión de Recursos', alignment: 'center', fontSize: 9 },
                  { text: 'Versión: 03', margin: [0, 2], fontSize: 9 },
                  ' ',
                ],
                [' ',
                  { text: 'Proceso: Gestión Contractual', alignment: 'center', fontSize: 9 },
                  { text: 'Fecha de Aprobación: 04/06/2019', fontSize: 9 },
                  ' ',
                ],
              ],
            },
          },

        ],
      },
      content: [
        {
          style: 'table',
          table: {
            widths: [136, '*', 113, 80],
            body: [
              [{ text: 'PUNTAJE DE LA EVALUACIÓN', bold: true },
              this.evaluacionRealizada.ValorFinal,
              { text: 'CALIFICACIÓN PROVEEDOR', bold: true },
              this.getCalificacion(),
              ],
              [
                { text: 'DEPENDENCIA QUE EVALUA', bold: true },
                this.dependencia,
                { text: 'FECHA', bold: true },
                this.formatDate(this.fechaEvaluacion),
              ],
            ],
          },
        },
        {
          style: 'table',
          table: {
            widths: [136, '*', 27, 90, 27, 70],
            body: [
              [
                { text: 'EMPRESA o PROVEEDOR', bold: true },
                { text: this.proveedor.NomProveedor, style: 'tableHeader', colSpan: 5 }, '', '', '', '',
              ],
              [
                { text: 'OBJETO DEL CONTRATO', bold: true },
                { text: this.contratoCompleto.ObjetoContrato, style: 'tableHeader', colSpan: 5 },
                '', '', '', '',
              ],
              [{ text: 'ITEM EVALUADO (*)', bold: true },
              { text: this.evaluacionRealizada.label, style: 'tableHeader', colSpan: 5 },
                '', '', '', '',
              ],
              [{ text: 'NOMBRE DEL SUPERVISOR ENCARGADO', bold: true },
              {
                border: [false, true, false, true],
                text: this.supervisor.Nombre,
              },
              {
                border: [false, true, false, true],
                text: 'Cargo:', bold: true,

              },
              {
                border: [false, true, false, true],
                fontSize: 8,
                text: this.supervisor.Cargo,
              },
              {
                border: [false, true, false, true],
                text: 'Firma', bold: true,
              },
              {
                border: [false, true, true, true],
                text: '', bold: true,
              },
              ],
            ],
          },
        },
        '\n\n',
        this.jsonPDF,
        this.obtenerObservaciones(),
        this.tablaEvaluadores(),
        '\n',
        {
          style: 'tableFooter',
          table: {
            widths: [51, 92, '*', 47],
            body: [
              [
                { rowSpan: 2, text: '\n\n\nCONVENCIÓN' },
                { text: '\nSÍMBOLO - SIGNIFICADO\n\n' },
                {
                  rowSpan: 2,
                  text: 'PROVEEDOR TIPO A: EXCELENTE. Puntaje mayor o igual a 80 hasta 100 puntos. Se puede contratar nuevamente.\n' +
                    'PROVEEDOR TIPO B: BUENO. Puntaje entre 46 hasta 79 puntos. Se invita nuevamente a procesos pero debe mejorar ' +
                    'las observaciones presentadas por la Universidad. La Universidad (Supervisor) presentará las observaciones ' +
                    'mediante oficio adjunto al presente formato.\n' +
                    'PROVEEDOR TIPO C: MALO. Puntaje inferior o igual a 45 puntos. La Universidad no debe contratar con este proveedor.',
                },
                [
                  {
                    alignment: 'center',
                    text: 'Puntaje Final',
                  },
                  {
                    alignment: 'center',
                    text: this.evaluacionRealizada.ValorFinal,
                    fontSize: 12,
                    brold: true,
                  },
                ],
              ],
              [
                '',
                '(*) - Este campo se diligencia exclusivamente en caso de Supervisión Compartida',
                '',
                {
                  alignment: 'center',
                  text: '\n\n' + this.getCalificacion(),
                },
              ],
            ],
          },
        },
      ],
      styles: {
        table: {
          margin: [0, 5, 0, 5],
          fontSize: 9,
        },
        tableFooter: {
          margin: [0, 5, 0, 5],
          fontSize: 8,
        },
        tableSeciones: {
          margin: [0, 5, 0, 10],
          fontSize: 10,
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black',
        },
        header: {
          bold: true,
          fontSize: 14,
          color: 'black',
        },
        subtitulo: {
          fontSize: 8,
          color: 'grey',
        },
      },
      images: {
        logo_ud: IMAGENES.escudo,
        logo_sigud: IMAGENES.sigud,
      },
    };
  }
}
