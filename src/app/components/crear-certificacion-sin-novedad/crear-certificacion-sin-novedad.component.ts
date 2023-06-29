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


    pdf.pageMargins([80, 10, 60, 30]);
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
              text:
                '\n \n UNIVERSIDAD DISTRITAL \n  FRANCISCO JOSÉ DE CALDAS \n  Sección de compras ',
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
      footer: [
        {
          text: [
            {
              text:
                'PBX: 3239300 Ext: 1911 – 1919 – 1912 \n Carrera 7 No. 40 B – 53 Piso 9°  Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016 ',
              style: 'body1',
              bold: true,
            },
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
          text: 'TULIO BERNARDO ISAZA SANTAMARIA  \n JEFE SECCIÓN DE COMPRAS',
          style: 'body1',
          bold: true,
          alignment: 'center',
        },
      ],
      firmaImagen: [
        {
          image:
            `data:image/jpeg;base64,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`,
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
                'EL SUSCRITO JEFE DE LA SECCIÓN DE COMPRAS DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS',
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
            pdf.add('\n\n');

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
              ]).layout('noBorders').alignment('center').widths([240, 160]).absolutePosition(75, 675).end
            );
            pdf.add(
              new Txt(
                'PARA CONSTANCIA SE AÑADE LA FECHA Y HORA DE CREACIÓN:' + this.horaCreacion
                /* this.horaCreacion.slice(0, 10) +
                ' - ' +
                this.horaCreacion.slice(11, 19), */
              )
                .bold()
                .alignment('center')
                .absolutePosition(75, 780)
                .fontSize(8).end,
            );

            pdf.footer(
              new Txt(
                'Carrera 7 No. 40 B – 53 Piso 9° PBX: 3239300 Ext: 1911 – 1919 – 1912 Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016',
              )
                .alignment('center')
                .bold().end,
            );

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
