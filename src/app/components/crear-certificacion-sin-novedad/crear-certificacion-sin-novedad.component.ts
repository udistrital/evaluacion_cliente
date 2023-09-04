import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { DocumentoService } from '../../@core/data/documento.service';
import { PdfMakeWrapper, Img, Columns, Table, Cell } from 'pdfmake-wrapper';
import { Txt } from 'pdfmake-wrapper';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { NbWindowService } from '@nebular/theme';
import pdfFonts from '../../../assets/skins/lightgray/fonts/custom-fonts';
import { EvaluacioncrudService } from '../../@core/data/evaluacioncrud.service';
import { AdministrativaamazonService } from '../../@core/data/admistrativaamazon.service';
import { NumerosAletrasService } from '../../@core/data/numeros-aletras.service';
import { take } from 'rxjs/operators';
import { GestorDocumentalService } from '../../@core/utils/gestor-documental.service';
import { IMAGENES } from '../images';

// Set the fonts to use

@Component({
  selector: 'ngx-crear-certificacion-sin-novedad',
  templateUrl: './crear-certificacion-sin-novedad.component.html',
  styleUrls: ['./crear-certificacion-sin-novedad.component.scss'],
})
export class CrearCertificacionSinNovedadComponent implements OnInit {
  @ViewChild('contentTemplate', { read: false })
  contentTemplate: TemplateRef<any>;
  @Output() volverFiltro: EventEmitter<Boolean>;
  @Input() dataContrato: any = [];
  uidDocumento: string;

  idDocumento: number;
  novedad: string;
  objeto: string;
  cedula: string;
  numeroContrato: string;
  actividadEspecifica: string;
  valorContrato: string;
  nombre: string;
  tipoPersona: string;
  idTipoContrato: number;
  // los valores que tienes un _ ejemplo valor_contrato son para validar si el usuario quiere ese dato en el pdf
  valor_Contrato: string;
  duracion_Contrato: string;
  fecha_Inicio: string;
  fecha_final: string;
  fecha_suscrip: string;
  duracion_contrato: string;
  observaciones: string;
  // ************************************************************************ */
  evaluacionRealizada: any;
  fechaEvaluacion: Date;
  calificacionManual: string = '';
  duracionContrato: string = '';
  horaCreacion: string = '';
  idContrato: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  texto_observacion: string = '';
  nuevo_texto: boolean = false;
  novedadCesion: boolean = false;
  novedadOtro: boolean = false;
  novedadProrroga: boolean = false;
  novedadAdiccion: boolean = false;
  novedadSuspension: boolean = false;
  novedadTerminacion: boolean = false;
  notaEvaluacionManual: boolean = false;
  // ************** Novedades
  tituloNovedad: string = '';
  textoNovedad: string = '';
  numeroNovedades: number;
  numeroNovedades2: number;

  fechaInicialSupension = new Date();
  fechaFinalSuspension = new Date();
  fechaTerminacion = new Date();
  numeroNovedadesCesion: number;
  numeroNovedadesOtro: number;
  numeroNovedadesProrroga: number;
  numeroNovedadesAddiccion: number;
  numeroNovedadesArr: string[] = [];
  numeroNovedadesArrOtro: string[] = [];
  numeroNovedadesArrProrroga: string[] = [];
  numeroNovedadesArrAdiccion: string[] = [];
  novedadesCesion: string[] = [];

  diasProrroga: string[] = [];
  mesesProrroga: string[] = [];
  valorAdicion: string[] = [];
  listaNovedades: string;

  constructor(
    private gestorDocumental: GestorDocumentalService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private evaluacionCrudService: EvaluacioncrudService,
    private AdministrativaAmazon: AdministrativaamazonService,
    private NumerosAletrasService: NumerosAletrasService,
  ) {
    this.volverFiltro = new EventEmitter();
    this.evaluacionRealizada = {};
    this.fechaEvaluacion = new Date();
  }

  ngOnInit() {
    this.evaluacionCrudService
      .get(
        'evaluacion?query=ContratoSuscrito:' +
        this.dataContrato[0].ContratoSuscrito +
        ',Vigencia:' +
        this.dataContrato[0].Vigencia,
      )
      .subscribe(
        (res_evaluacion) => {
          if (Object.entries(res_evaluacion.Data[0]).length !== 0) {
            this.evaluacionCrudService
              .get(
                'resultado_evaluacion?query=IdEvaluacion:' +
                res_evaluacion.Data[0].Id +
                ',Activo:true',
              )
              .subscribe(
                (res_resultado_eva) => {
                  this.notaEvaluacionManual = false;

                  if (res_resultado_eva !== null) {
                    this.evaluacionRealizada = JSON.parse(
                      res_resultado_eva.Data[0].ResultadoEvaluacion,
                    );

                    this.fechaEvaluacion = new Date(
                      res_resultado_eva.Data[0].FechaCreacion.substr(0, 16),
                    );
                  }
                },
                (error_service) => {
                  this.openWindow(error_service.message);
                },
              );
          } else {
            this.openWindow(
              'El contrato no ha sido evaluado Por este motivo se habilitó para añadir la calificación manual.',
            );
            this.notaEvaluacionManual = true;
          }
        },
        (error_service) => {
          this.openWindow(error_service.message);
        },
      );

    this.consultarDatosContrato();
  }
    regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  crearPdf() {
    const cadena1 = 'Que el señor(a) ';
    const cadena2 = ' Identificado(a) con cédula de ciudadanía No. ';
    const cadena3 = ' , cumplió a satisfacción con las siguientes órdenes: ';
    const cadena4 = 'Que la empresa ';
    const cadena5 = ' identificada con el NIT ';

    PdfMakeWrapper.setFonts(pdfFonts, {
      myCustom: {
        normal: 'calibri-light-2.ttf',
        bold: 'calibri-bold-2.ttf',
        italics: 'calibri-light-2.ttf',
        bolditalics: 'calibri-light-2.ttf',
      },
    });
    PdfMakeWrapper.useFont('myCustom');
    let tipoContrato = '';

    const pdf = new PdfMakeWrapper();
    if (this.idTipoContrato === 14) {
      tipoContrato = 'ORDEN DE SERVICIO';

    } else if (this.idTipoContrato === 6) {
      tipoContrato = 'PRESTACIÓN DE SERVICIOS';

    } else if (this.idTipoContrato === 7) {
      tipoContrato = 'ORDEN DE VENTA';
    } else if (this.idTipoContrato === 15) {
      tipoContrato = 'ORDEN DE COMPRA';
    }


    pdf.pageMargins([80, 100, 60, 60]);
    pdf.styles({
      Title: {
        bold: true,
        fontSize: 14,
        alignment: 'center',
      },
      body: {
        fontSize: 11,
        alignment: 'justify',
      },
      body1: {
        fontSize: 11,
        bold: true,
        alignment: 'justify',
      },
    });

    const docDefinition = {
      content: [
        {
          text: [
            { text: cadena1, style: 'body' },
            { text: this.nombre, style: 'body1' }, // nombre
            { text: cadena2, style: 'body' },
            { text: this.cedula, style: 'body1', bold: true }, // cedula
            { text: cadena3, style: 'body' },
            { text: '', style: 'body' },
          ],
        },
      ],
      content1: [
        {
          text: [
            { text: cadena4, style: 'body' },
            { text: this.nombre, style: 'body1' }, // nombre
            { text: cadena5, style: 'body' },
            { text: this.cedula, style: 'body1', bold: true }, // cedula
            { text: cadena3, style: 'body' },
            { text: '', style: 'body' },
          ],
        },
      ],
      line: [
        {
          text:
            '___________________________________________________________________________________',
          style: 'body',
        },
      ],
      numContrato: [
        {
          text: [
            { text: 'CONTRATO DE ORDEN DE SERVICIO NRO. ', style: 'body1', bold: true },
            { text: this.numeroContrato, style: 'body1' },
            {
              text: ' DE ' + this.formato(this.fecha_suscrip.slice(0, 10)),
              style: 'body1',
            },
          ],
        },
      ],
      numContrato2: [
        {
          text: [
            { text: `CONTRATO DE ${tipoContrato} NO. `, style: 'body1', bold: true },
            { text: this.numeroContrato, style: 'body1' },
            {
              text: ' DE ' + this.formato(this.fecha_suscrip.slice(0, 10)),
              style: 'body1',
            },
          ],
        },
      ],
      numContrato3: [
        {
          text: [
            { text: 'CONTRATO DE ORDEN DE VENTA NRO ', style: 'body1', bold: true },
            { text: this.numeroContrato, style: 'body1' },
            {
              text: ' DE ' + this.formato(this.fecha_suscrip.slice(0, 10)),
              style: 'body1',
            },
          ],
        },
      ],
      content2: [
        {
          text: [
            { text: 'OBJETO: ', style: 'body1', bold: true },
            { text: this.objeto.toUpperCase(), style: 'body' }, // objeto del contrato
          ],
        },
      ],
      content3: [
        {
          text: [
            { text: 'ACTIVIDAD ESPECÍFICA: ', style: 'body1', bold: true },
            { text: this.actividadEspecifica, style: 'body' },
          ],
        },
      ],
      content4: [
        {
          text: [
            { text: '-' + tipoContrato + ' ', style: 'body1' },
            { text: this.dataContrato[0].ContratoSuscrito, style: 'body1' },
            { text: ' DE ' + this.dataContrato[0].Vigencia, style: 'body1' }
          ],
        },
      ],
      valorContra: [
        {
          text: [
            { text: 'VALOR DEL CONTRATO: $ ', style: 'body1', bold: true },
            { text: this.numeromiles(this.valorContrato), style: 'body' },
            {
              text:
                ' ' +
                this.NumerosAletrasService.convertir(
                  parseInt(this.valorContrato),
                ),
              style: 'body1',
            },
          ],
        },
      ],
      valorCabe: [
        {
          text: [
            {
              text: `
                UNIVERSIDAD DISTRITAL
                FRANCISCO JOSÉ DE CALDAS
                Vicerrectoría Administrativa y Financiera
                Oficina de Contratación`,
              style: 'body1',
              bold: true,
            },
          ],
        },
      ],
      duraContraDias: [
        {
          text: [
            { text: 'DURACIÓN:  ', style: 'body1', bold: true },
            {
              text:
                this.NumerosAletrasService.convertir(
                  parseInt(this.duracionContrato),
                ).slice(0, -7) +
                '' +
                this.duracionContrato +
                ' DÍAS',
              style: 'body',
            },
          ],
        },
      ],
      duraContraMes: [
        {
          text: [
            { text: 'DURACIÓN:  ', style: 'body1', bold: true },
            {
              text:
                this.NumerosAletrasService.convertir(
                  parseInt(this.duracionContrato),
                ).slice(0, -7) +
                '(' +
                this.duracionContrato +
                ') MESES',
              style: 'body',
            },
          ],
        },
      ],
      fechaSub: [
        {
          text: [
            { text: 'FECHA DE SUSCRIPCIÓN:  ', style: 'body1', bold: true },
            {
              text: this.formato(this.fecha_suscrip.slice(0, 10)),
              style: 'body',
            },
          ],
        },
      ],
      resultadoEva: [
        {
          text: [
            { text: 'CUMPLIMIENTO:  ', style: 'body1', bold: true },
            { text: this.getCalificacion(), style: 'body' },
          ],
        },
      ],
      textObservaciones: [
        {
          text: [
            {
              text: 'OBSERVACIONES: ',
              style: 'body1',
              bold: true,
            },
            { text: this.texto_observacion.toUpperCase(), style: 'body' },
          ],
        },
      ],
      fechainicio: [
        {
          text: [
            { text: 'FECHA DE INICIO:  ', style: 'body1', bold: true },
            {
              text: this.formato(this.fechaInicio),
              style: 'body',
            },
          ],
        },
      ],
      fechafin: [
        {
          text: [
            { text: 'FECHA DE FINALIZACION:  ', style: 'body1', bold: true },
            {
              text: this.formato(this.fechaFin),
              style: 'body',
            },
          ],
        },
      ],
      novedadContraTerminacion: [
        {
          text: [
            {
              text: 'NOVEDAD CONTRACTUAL:',
              style: 'body1',
              bold: true,
            },
            {
              text:
                'ACTA DE TERMINACIÓN Y LIQUIDACIÓN BILATERAL ' +
                this.formato(this.fechaTerminacion),
              style: 'body',
              bold: true,
            },
          ],
        },
      ],
      novedadContraSuspension: [
        {
          text: [
            {
              text: 'NOVEDAD CONTRACTUAL: ',
              style: 'body1',
              bold: true,
            },
            {
              text:
                'ACTA DE SUSPENSIÓN DE ' +
                this.diasFecha(
                  this.fechaInicialSupension,
                  this.fechaFinalSuspension,
                ) +
                ' DÍAS ' +
                'DESDE ' +
                this.formato(this.fechaInicialSupension) +
                ' HASTA ' +
                this.formato(this.fechaFinalSuspension),
              style: 'body',
              bold: true,
            },
          ],
        },
      ],
      firmaPagina: [
        {
          text: 'DIANA XIMENA PIRACHICÁN MARTÍNEZ  \n OFICINA DE CONTRATACIÓN',
          style: 'body1',
          bold: true,
          alignment: 'center',
        },
      ],
      firmaImagen: [
        {
          image: IMAGENES.firma,
          alignment: 'center',
          width: 150,
        },
      ],
      escudoImagen: [
        {
          image: IMAGENES.escudo,
          alignment: 'center',
          width: 45,
        },
      ],
    };

    // -------------------------------------------------------------------------------------

    let arreglo = [];
    let arreglo2 = [];
    if (this.listaNovedades != null) {
      for (var i = 0; i < this.listaNovedades.length; i++) {
        if (this.listaNovedades[i] == 'cesion') {
          this.novedadCesion = true;
        }
        if (this.listaNovedades[i] == 'adicion') {
          this.novedadAdiccion = true;
        }
        if (this.listaNovedades[i] == 'prorroga') {
          this.novedadProrroga = true;
        }
        if (this.listaNovedades[i] == 'suspension') {
          this.novedadSuspension = true;
        }
        if (this.listaNovedades[i] == 'terminacionLiquidacion') {
          this.novedadTerminacion = true;
        }
        if (this.listaNovedades[i] == 'observaciones') {
          this.nuevo_texto = true;
        }
      }
    }

    if (this.novedadAdiccion == true) {
      for (var i = 0; i < this.numeroNovedadesAddiccion; i++) {
        if (
          parseInt(this.valorAdicion[i], 10) >
          parseInt(this.valorContrato, 10) * 0.5
        ) {
          this.openWindow(
            'El Valor de la adición no puede exceder el 50% del valor total del contrato',
          );
          return 0;
        }
      }
    }

    /* pdf.create().getBlob((blob) => {
      const file = {
        IdDocumento: 16,
        file: blob,
        nombre: '',
      };
      arreglo.push(file);
      arreglo.forEach((file) => {
        (file.Id = file.nombre),
          (file.nombre =
            'certificacion_' +
            file.Id +
            this.numeroContrato +
            '__' +
            this.cedula +
            '_cumplimiento');
        file.key = file.Id;
      }); */
      /* this.nuxeoService
        .getDocumentos$(arreglo, this.documentoService)
        .pipe(take(1))
        .subscribe(
          (response) => { */
            this.horaCreacion = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

            pdf.add(
              new Table([
                [
                  docDefinition.escudoImagen,
                  docDefinition.valorCabe,/* 
                  new Txt('Código de autenticidad:' + response['Enlace'])
                    .bold()
                    .alignment('right')
                    .fontSize(9).end, */
                ],
              ]).layout('noBorders').end,
            );
            pdf.add('\n');

            pdf.add(
              new Txt(
                'EL SUSCRITO JEFE DE LA OFICINA DE CONTRATACIÓN DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS',
              ).style('Title').end,
            );
            pdf.add(new Txt('NIT: 899.999.230-7').style('Title').end);
            pdf.add('\n');

            pdf.add(new Txt('CERTIFICA').style('Title').end);

            pdf.add('\n');
            // ------------------------------ se arma el primer parrafo
            if (this.tipoPersona == 'NATURAL') {
              pdf.add(docDefinition.content[0]);
            } else if (this.tipoPersona == 'JURIDICA') {
              pdf.add(docDefinition.content1[0]);
            }

            pdf.add(docDefinition.line);
            pdf.add('\n');
            // --------------- numero de contrato
            pdf.add(docDefinition.content4);
            pdf.add('\n');
            // -------------------------------- Objeto
            pdf.add(docDefinition.content2);
            pdf.add('\n');
            // -------------------------------- fehca de suscripcion
            pdf.add(docDefinition.fechaSub);
            pdf.add('\n');
            if (this.fecha_Inicio == '1') {
              pdf.add(docDefinition.fechainicio);
              pdf.add('\n');
            }
            if (this.fecha_final == '1') {
              pdf.add(docDefinition.fechafin);
              pdf.add('\n');
            }
            if (this.valor_Contrato == '1') {
              pdf.add(docDefinition.valorContra);
            }
            pdf.add('\n');
            if (this.duracion_contrato == '1') {

              if (parseInt(this.duracionContrato) > 12) {
                pdf.add(docDefinition.duraContraDias);

              } else if (parseInt(this.duracionContrato) <= 12) {
                pdf.add(docDefinition.duraContraMes);
              }
            }
            pdf.add('\n');
            if (this.calificacionManual !== "") {
              pdf.add(docDefinition.resultadoEva);
              pdf.add('\n');
            }
            if (this.observaciones == '1') {
              pdf.add(docDefinition.textObservaciones);
              pdf.add('\n');
            }

            pdf.add('\n');
            if (this.novedadCesion == true) {
              for (var i = 0; i < this.numeroNovedadesCesion; i++) {
                var contador = i + 1;
                pdf.add(
                  new Txt(
                    'CESIÓN N° ' +
                    contador +
                    ` DEL CONTRATO DE ${tipoContrato} NO ` +
                    this.dataContrato[0].ContratoSuscrito +
                    '-' +
                    this.dataContrato[0].Vigencia,
                  ).bold().end,
                );
              }
            }
            if (this.novedadAdiccion == true) {
              for (var i = 0; i < this.numeroNovedadesAddiccion; i++) {
                var contador = i + 1;
                pdf.add(
                  new Txt(
                    'ADDICIÓN N° ' +
                    contador +
                    ` DEL CONTRATO DE ${tipoContrato}  NO ` +
                    this.dataContrato[0].ContratoSuscrito +
                    '-' +
                    this.dataContrato[0].Vigencia,
                  ).bold().end,
                );

                pdf.add(
                  new Txt(
                    'VALOR: $' +
                    this.numeromiles(this.valorAdicion[i]) +
                    ' ' +
                    this.NumerosAletrasService.convertir(
                      parseInt(this.valorAdicion[i])
                    ),
                  ).bold().end,
                );
              }
              pdf.add('\n');
            }
            if (this.novedadProrroga == true) {
              for (var i = 0; i < this.numeroNovedadesProrroga; i++) {
                var contador = i + 1;
                pdf.add(
                  new Txt(
                    'Prórroga N° ' +
                    contador +
                    ` DEL CONTRATO DE ${tipoContrato} NO ` +
                    this.dataContrato[0].ContratoSuscrito +
                    '-' +
                    this.dataContrato[0].Vigencia,
                  ).bold().end,
                );
                if (this.diasProrroga[i].length == 0) {
                  pdf.add(
                    new Txt(
                      'DURACIÓN:' +
                      this.NumerosAletrasService.convertir(
                        parseInt(this.mesesProrroga[i]),
                      ).slice(0, -7) +
                      '' +
                      this.mesesProrroga[i] +
                      ' Meses',
                    ).bold().end,
                  );
                } else if (this.mesesProrroga[i].length == 0) {
                  pdf.add(
                    new Txt(
                      'DURACIÓN:' +
                      this.NumerosAletrasService.convertir(
                        parseInt(this.diasProrroga[i]),
                      ).slice(0, -7) +
                      '' +
                      this.diasProrroga[i] +
                      ' DÍAS',
                    ).bold().end,
                  );
                } else if (this.mesesProrroga[i] == '1') {
                  pdf.add(
                    new Txt(
                      'DURACIÓN:' +
                      this.diasProrroga[i] +
                      ' DÍAS Y ' +
                      this.mesesProrroga[i] +
                      ' Mes',
                    ).bold().end,
                  );
                } else {
                  pdf.add(
                    new Txt(
                      'DURACIÓN:' +
                      this.diasProrroga[i] +
                      ' DÍAS Y ' +
                      this.mesesProrroga[i] +
                      ' Meses',
                    ).bold().end,
                  );
                }
              }
              pdf.add('\n');
            }
            if (this.novedadTerminacion == true) {
              pdf.add(docDefinition.novedadContraTerminacion);
            }
            if (this.novedadSuspension == true) {
              pdf.add(docDefinition.novedadContraSuspension);
            }
            pdf.add(
              new Txt(
                'Fecha de expedición de la certificación a solicitud del interesado: ' + this.horaCreacion,
              )
                .alignment('left')
                .fontSize(9).end,
            );

            pdf.add(
              new Table([
                [
                  docDefinition.firmaImagen,
                  {
                    rowSpan: 2,
                    text:
                      '\n\n\n\n____________________\n' +
                      'Firma del supervisor',
                    style: {
                      alignment: 'center',
                      bold: true
                    }
                  }
                ],
                [
                  docDefinition.firmaPagina,
                ]
              ]).layout('noBorders').alignment('center').widths([240, 160]).absolutePosition(75, 655).end
            );

            pdf.footer({
              columns: [
                {
                  stack: [
                    { text: ' ', fontSize: 8 },
                    { text: ' ', fontSize: 8 },
                    { text: 'PBX 601 3239300 ext. 1859 - 1862', fontSize: 8 },
                    { text: 'Calle 13 n.° 31 -75, Bogotá D. C., Colombia', fontSize: 8 },
                    { text: 'Acreditación Institucional en Alta Calidad. Resolución No. 02365 3 del 10 de diciembre de 2021', fontSize: 7 },
                  ],
                  width: '65%',
                  alignment: 'left',
                  margin: [50, 0],
                },
                {
                  stack: [
                    { text: 'Línea de atención gratuita', decoration: 'underline' },
                    { text: '01  800  091  44  10', bold: true },
                    { text: 'www.udistrital.edu.coo' },
                    { text: 'procesoscontratacion@udistrital.edu.co' },
                    { text: 'tramitescontratacion@udistrital.edu.co' },
                  ],
                  width: '35%',
                  alignment: 'right',
                  fontSize: 8,
                  margin: [40, 0],
                },
              ],
            });

            pdf.create().getBlob((blob) => {
              const file2 = {
                IdDocumento: 16,
                file: blob,
                nombre: '',
                //documento: response['Enlace'],
              };
              arreglo2.push(file2);
              arreglo2.forEach((file) => {
                (file.Id = file.nombre),
                  (file.nombre =
                    'certificacion_' +
                    file.Id +
                    this.numeroContrato +
                    '__' +
                    this.cedula +
                    '_cumplimiento');
                file.key = file.Id;
              });

              this.gestorDocumental.uploadFiles(arreglo2)
/*               this.nuxeoService
                .updateDocument$(arreglo2, this.documentoService) */
                .subscribe((response: any[]) => {
                  if (response[0].Status == "200") {
                    pdf
                    .create()
                    .download(
                      'Certificacion_' +
                      this.numeroContrato +
                      '__' +
                      this.cedula +
                      '_cumplimiento',
                    );
                    this.regresarInicio();
                  } else {
                    this.openWindow("Fallo en carga a Gestor Documental");
                  }
                },
                (error) => {
                  this.openWindow(error.status + ": " + error.message);
                });
            });

            
          /* },
          (error) => { },
        ); */
    //});

  }

  regresarInicio() {
    const Swal = require('sweetalert2');
    Swal.fire({
      icon: 'success',
      title: 'CERTIFICACIÓN CREADA',
      text: 'La certificación fue creada con exito',
      footer: 'La certificacion fue creada para: ' + this.nombre,
    });
    this.regresarFiltro();
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
        this.valorContrato =
          res_contrato.Data[0].contrato_general.ValorContrato;
        this.cedula = res_contrato.Data[0].informacion_proveedor.NumDocumento;
        this.nombre = res_contrato.Data[0].informacion_proveedor.NomProveedor;
        this.numeroContrato =
          res_contrato.Data[0].contrato_general.ContratoSuscrito[0].NumeroContratoSuscrito;
        this.fecha_suscrip =
          res_contrato.Data[0].contrato_general.ContratoSuscrito[0].FechaSuscripcion;

        this.duracionContrato =
          res_contrato.Data[0].contrato_general.PlazoEjecucion;
        this.idContrato =
          res_contrato.Data[0].contrato_general.ContratoSuscrito[0].NumeroContrato.Id;

        this.tipoPersona =
          res_contrato.Data[0].informacion_proveedor.Tipopersona;

        this.idTipoContrato =
          res_contrato.Data[0].contrato_general.TipoContrato.Id;
        this.actividadEspecifica = res_contrato.Data[0].actividades_contrato.contrato.actividades;
      }),
      (error_service) => {
        this.openWindow(error_service.message);
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
  getCalificacion() {
    if (Object.entries(this.evaluacionRealizada).length == 0) {
      return this.calificacionManual;
    } else {
      for (
        let i = 0;
        i < this.evaluacionRealizada.Clasificaciones.length;
        i++
      ) {
        if (
          this.evaluacionRealizada.ValorFinal >=
          this.evaluacionRealizada.Clasificaciones[i].LimiteInferior &&
          this.evaluacionRealizada.ValorFinal <=
          this.evaluacionRealizada.Clasificaciones[i].LimiteSuperior
        ) {
          return this.evaluacionRealizada.Clasificaciones[i].Nombre;
        }
      }
    }
  }
  crearNovedades() {
    this.numeroNovedadesArr.length = 0;
    for (var i = 0; i < this.numeroNovedadesCesion; i++) {
      // console.log(i);
      this.numeroNovedadesArr.push('');
    }
    /*Guardothis.numeroNovedadesArrOtro.length = 0;
    for (var i = 0; i < this.numeroNovedadesOtro; i++) {
      //console.log(i);
      this.numeroNovedadesArrOtro.push('');
    }*/
    this.numeroNovedadesArrProrroga.length = 0;
    for (var i = 0; i < this.numeroNovedadesProrroga; i++) {
      // console.log(i);
      this.numeroNovedadesArrProrroga.push('');
    }

    this.numeroNovedadesArrAdiccion.length = 0;
    for (var i = 0; i < this.numeroNovedadesAddiccion; i++) {
      this.numeroNovedadesArrAdiccion.push('');
    }
  }
  diasFecha(fecha1, fecha2) {
    var date_1 = new Date(fecha1.toString()).getTime();
    var date_2 = new Date(fecha2.toString()).getTime();
    // console.log(date_1, date_2);
    if (date_2 < date_1) {
      this.openWindow(
        'Error la fecha de finalizacion siempre debe ser mayor a la fecha de inicio',
      );
      this.regresarFiltro();
    } else {
      var diff = date_2 - date_1;

      return diff / (1000 * 60 * 60 * 24);
    }
  }
  numeromiles(num) {
    num = num
      .toString()
      .split('')
      .reverse()
      .join('')
      .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    num = num.split('').reverse().join('').replace(/^[\.]/, '');
    return num;
  }
  formato(texto) {
    return texto.toString().replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
  }
}
