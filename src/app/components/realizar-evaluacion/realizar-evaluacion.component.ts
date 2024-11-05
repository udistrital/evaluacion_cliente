import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { EvaluacioncrudService } from '../../@core/data/evaluacioncrud.service';
import { NbWindowService } from '@nebular/theme';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { GestorDocumentalService } from '../../@core/utils/gestor-documental.service';
import { FirmaElectronicaService } from '../../@core/utils/firma_electronica.service';
import { DocumentoService } from '../../@core/data/documento.service';
import { UserService } from '../../@core/data/user.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { IMAGENES } from '../images';

@Component({
  selector: 'ngx-realizar-evaluacion',
  templateUrl: './realizar-evaluacion.component.html',
  styleUrls: ['./realizar-evaluacion.component.scss'],
})
export class RealizarEvaluacionComponent implements OnInit {
  @Input() dataContrato: any = [];
  @Output() volverFiltro: EventEmitter<Boolean>;
  @ViewChild('contentTemplate', { read: false }) contentTemplate: TemplateRef<any>;
  realizar: boolean;
  evaluacionRealizada: any;
  idResultadoEvalucion: any;
  idEvaluacion: any;

  fechaEvaluacion: any;
  jsonPDF: any;
  observacionesPdf: string;
  proveedor: any;
  dependencia: String;
  contratoCompleto: any;
  supervisor: any;

  constructor(
    private evaluacionCrudService: EvaluacioncrudService,
    private windowService: NbWindowService,
    private evaluacionMidService: EvaluacionmidService,
    private firmaElectronica: FirmaElectronicaService,
    private gestorDocumental: GestorDocumentalService,
    private documentoService: DocumentoService,
    private userService: UserService,
  ) {
    this.volverFiltro = new EventEmitter();
    this.evaluacionRealizada = {};
    this.idResultadoEvalucion = 0;
    this.jsonPDF = [];
    this.proveedor = {};
    this.dependencia = '';
    this.contratoCompleto = {};
    this.supervisor = {};
  }

  ngOnInit() {
    this.consultaEvaluacion();
    this.consultarDatosContrato();
  }

  private consultaEvaluacion() {
    this.evaluacionCrudService.getResultadoByContratoVigencia(this.dataContrato[0].ContratoSuscrito, this.dataContrato[0].Vigencia)
      .subscribe((res_resultado_eva: any) => {
        this.realizar = true;
        if (res_resultado_eva && res_resultado_eva.Data && res_resultado_eva.Data.length && Object.keys(res_resultado_eva.Data[0]).length) {
          this.openWindow('Ya hay una evaluación existente, usted procederá a modificarla.');
          this.evaluacionRealizada = res_resultado_eva.Data[0];
          this.idResultadoEvalucion = res_resultado_eva.Data[0].Id;
        } else {
          this.evaluacionCrudService.getEvaluacionByContratoVigencia(this.dataContrato[0].ContratoSuscrito, this.dataContrato[0].Vigencia)
            .subscribe((res_evaluacion: any) => {
              if (res_evaluacion && res_evaluacion.Data && res_evaluacion.Data.length && res_evaluacion.Data[0].Id) {
                this.idEvaluacion = res_evaluacion.Data[0];
              }
            }, (error_service) => {
              this.openWindow(error_service.message);
            });
        }
      }, (error_service) => {
        this.openWindow(error_service.message);
      });
  }

  consultarDatosContrato() {
    this.evaluacionMidService.get('datosContrato?NumContrato=' + this.dataContrato[0].ContratoSuscrito +
      '&VigenciaContrato=' + this.dataContrato[0].Vigencia)
      .subscribe((res_contrato) => {
        this.dependencia = res_contrato.Data[0].dependencia_SIC.ESFDEPENCARGADA;
        this.proveedor = res_contrato.Data[0].informacion_proveedor;
        this.contratoCompleto = res_contrato.Data[0].contrato_general;
        this.supervisor = this.contratoCompleto.Supervisor;
      }), (error_service) => {
        this.openWindow(error_service.message);
        this.regresarFiltro();
      };
  }

  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  realizarEvaluacion(data: any) {
    const firmantes = data.firmantes;
    delete data.firmantes;

    // Se verifica si hay una evalucion existente
    if (!this.idResultadoEvalucion && !this.idEvaluacion) {
      const jsonEvaluacion = {
        Activo: true,
        Aprobado: true,
        ContratoSuscrito: Number(this.dataContrato[0].ContratoSuscrito),
        CotizacionId: 0,
        PlantillaId: data.Id,
        ProveedorId: this.dataContrato[0].IdProveedor,
        Vigencia: this.dataContrato[0].Vigencia,
      };

      this.evaluacionCrudService.post('evaluacion', jsonEvaluacion)
        .subscribe((res_evaluacion) => {
          if (res_evaluacion !== null) {
            this.posResultadoEvaluacion(res_evaluacion['Data'], data, firmantes);
          }
        }, (error_service) => {
          this.openWindow(error_service.message);
        });

    } else if (!this.idResultadoEvalucion && this.idEvaluacion) {
      this.posResultadoEvaluacion(this.idEvaluacion, data, firmantes);
    } else if (this.idResultadoEvalucion && !this.idEvaluacion) {
      this.evaluacionCrudService.get('resultado_evaluacion?query=Activo:true,Id:' + this.idResultadoEvalucion)
        .subscribe((res_resultado_eva) => {
          if (res_resultado_eva !== null) {
            res_resultado_eva.Data[0].Activo = false;
            this.evaluacionCrudService.put('resultado_evaluacion', res_resultado_eva.Data[0])
              .subscribe((res_eva_actual) => {
                if (res_eva_actual !== null) {
                  this.posResultadoEvaluacion(res_eva_actual['Data']['IdEvaluacion'], data, firmantes);
                }
              }, (error_service) => {
                this.openWindow(error_service.message);
              });
          }
        }, (error_service) => {
          this.openWindow(error_service.message);
        });
    }
  }

  private posResultadoEvaluacion(IdEvaluacion, resultado, firmantes) {
    const jsonResultadoEvaluacion = {
      Activo: true,
      IdEvaluacion,
      ResultadoEvaluacion: JSON.stringify(resultado),
    };

    this.userService.getPersonaNaturalAmazon().
      subscribe((res: any) => {
        const representantes = [];
        if (res && res.length && res[0].Id) {
          representantes.push(this.userService.fillRepresentante(res[0]));
        }

        this.evaluacionCrudService.post('resultado_evaluacion', jsonResultadoEvaluacion)
          .subscribe((res_res_eva: any) => {
            if (res_res_eva !== null) {
              this.prepareUploadPDF(res_res_eva.Data.ResultadoEvaluacion, res_res_eva.Data.FechaCreacion, firmantes, representantes)
                .then((file) => {
                  this.deletePreviusDocs(file[0].nombre);
                  this.firmaElectronica.uploadFilesElectronicSign(file)
                    .subscribe((response) => {
                      this.openWindow('Se ha actualizado satisfactoriamente la evaluación del contrato ' + this.dataContrato[0].ContratoSuscrito +
                        ' de ' + this.dataContrato[0].Vigencia);
                      this.regresarFiltro();
                    });
                });
            }
          }, (error_service) => {
            this.openWindow(error_service.message);
          });
      });

  }

  crearJsonPDF() {
    this.jsonPDF = [];
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

  getCalificacion() {
    for (let i = 0; i < this.evaluacionRealizada.Clasificaciones.length; i++) {
      if (this.evaluacionRealizada.ValorFinal >= this.evaluacionRealizada.Clasificaciones[i].LimiteInferior
        && this.evaluacionRealizada.ValorFinal <= this.evaluacionRealizada.Clasificaciones[i].LimiteSuperior) {
        return this.evaluacionRealizada.Clasificaciones[i].Nombre;
      }
    }
  }

  formatDate(date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  obtenerObservaciones() {
    let obsStruct = {};
    if (this.evaluacionRealizada.observaciones !== undefined) {
      this.observacionesPdf = this.evaluacionRealizada.observaciones;
      obsStruct = [
        {
          text: 'Observaciones', bold: true, style: 'header',
        },
        {
          text: '\n' + this.evaluacionRealizada.observaciones, style: 'tableSeciones',
        },
      ];
    }
    return obsStruct;
  }

  async prepareUploadPDF(data: any, fecha: any, firmantes: any[], representantes: any[]) {
    this.evaluacionRealizada = JSON.parse(data);
    this.fechaEvaluacion = new Date(fecha.substr(0, 16));
    this.crearJsonPDF();

    const blob = await new Promise<Blob>((resolve) => {
      pdfMake.createPdf(this.makePdf2())
        .getBlob((blob_) => {
          resolve(blob_);
        });
    });

    return [{
      IdDocumento: 16,
      file: blob,
      nombre: 'evaluacion_contrato_' + this.dataContrato[0].ContratoSuscrito +
        '_vig_' + this.dataContrato[0].Vigencia + '_proveedor_' + this.dataContrato[0].IdProveedor,
      firmantes,
      representantes,
    }];
  }

  deletePreviusDocs(nombreDoc: string) {
    this.documentoService.get('documento?limit=0&query=Activo:true,Nombre:' + nombreDoc)
      .subscribe((response: any[]) => {
        if (Object.keys(response[0]).length > 0) {
          response.forEach((doc) => {
            doc.Activo = false;
            this.documentoService.put('documento', doc).subscribe(res => { });
          });
        }
      });
  }

  makePdf2() {
    const horaCreacion = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
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
                { text: 'EMPRESA O PROVEEDOR', bold: true },
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
        '\n',
        this.jsonPDF,
        this.obtenerObservaciones(),
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
        {
          text: 'Fecha de expedición de la certificación a solicitud del interesado: ' + horaCreacion,
          style: 'tableFooter',
        },
      ],
      footer: [
        {
          text: '.',
          style: 'tableFooter',
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

  openWindow(mensaje) {
    this.windowService.open(
      this.contentTemplate,
      { title: 'Alerta', context: { text: mensaje } },
    );
  }

}
