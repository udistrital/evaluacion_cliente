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
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../@core/data/documento.service';
import { PdfMakeWrapper, Img, Columns, Table, Cell } from 'pdfmake-wrapper';
import { Txt } from 'pdfmake-wrapper';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import { NbWindowService } from '@nebular/theme';
import pdfFonts from '../../../assets/skins/lightgray/fonts/custom-fonts';
import { EvaluacioncrudService } from '../../@core/data/evaluacioncrud.service';
import { AdministrativaamazonService } from '../../@core/data/admistrativaamazon.service';
import { AdministrativajbpmService } from '../../@core/data/administrativajbpm.service';
import { NumerosAletrasService } from '../../@core/data/numeros-aletras.service';
import { take } from 'rxjs/operators';

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
  @Input() rol: string;
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
  // ************************************************************************ */
  evaluacionRealizada: any;
  fechaEvaluacion: Date;
  calificacionManual: string = '';
  duracionContrato: string = '';
  horaCreacion: string = '';
  idContrato: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
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
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private evaluacionCrudService: EvaluacioncrudService,
    private AdministrativaJbpm: AdministrativajbpmService,
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
    const cadena1 = 'QUE EL SEÑOR(A) ';
    const cadena2 = ' IDENTIFICADO(A) CON CÉDULA DE CIUDADANÍA NO. ';
    const cadena3 = ' , CUMPLIO A SATISFACCIÓN CON LAS SIGUIENTES ORDENES ';
    const cadena4 = 'QUE LA EMPRESA ';
    const cadena5 = ' IDENTIFICADA CON NIT DE CIUDADANÍA NO. ';

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
    if(this.idTipoContrato === 14) {
      tipoContrato = 'ORDEN DE SERVICIO';

    } else if(this.idTipoContrato === 6) {
      tipoContrato = 'PRESTACIÓN DE SERVICIOS';

    } else if(this.idTipoContrato === 7) {
      tipoContrato = 'ORDEN DE VENTA';
      
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
            { text: this.objeto, style: 'body' }, // objeto del contrato
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
      valorContra: [
        {
          text: [
            { text: 'VALOR: $ ', style: 'body1', bold: true },
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
            { text: 'DURACION:  ', style: 'body1', bold: true },
            {
              text:
                this.NumerosAletrasService.convertir(
                  parseInt(this.duracionContrato),
                ).slice(0, -7) +
                '' +
                this.duracionContrato +
                ' DIAS',
              style: 'body',
            },
          ],
        },
      ],
      duraContraMes: [
        {
          text: [
            { text: 'DURACION:  ', style: 'body1', bold: true },
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
      texTituloNovedad: [
        {
          text: [
            {
              text: 'OBSERVACIONES' + ': ',
              style: 'body1',
              bold: true,
            },
            { text: this.textoNovedad.toUpperCase(), style: 'body' },
          ],
        },
      ],
      fechainicio: [
        {
          text: [
            { text: 'FECHA DE INICIO:  ', style: 'body1', bold: true },
            {
              text: this.formato(this.fechaInicio.slice(0, 10)),
              style: 'body',
            },
          ],
        },
      ],
      fechafin: [
        {
          text: [
            { text: 'FECHA DE FINALIZACION:  ', style: 'body1', bold: true },
            { text: this.formato(this.fechaFin.slice(0, 10)), style: 'body' },
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
                ' DIAS ' +
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
          absolutePosition: { x: 75, y: 750 },
        },
      ],
      firmaImagen: [
        {
          image:
            `data:image/jpeg;base64,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`,
          alignment: 'center',
          width: 150,
          absolutePosition: { x: 75, y: 700 },
        },
      ],
      escudoImagen: [
        {
          image:
            'data:image/jpeg;base64,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',
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

    pdf.create().getBlob((blob) => {
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
      });
      this.nuxeoService
        .getDocumentos$(arreglo, this.documentoService)
        .pipe(take(1))
        .subscribe(
          (response) => {
            this.horaCreacion = response['FechaCreacion'];

            pdf.add(
              new Table([
                [
                  docDefinition.escudoImagen,
                  docDefinition.valorCabe,
                  new Txt('Código de autenticidad:' + response['Enlace'])
                    .bold()
                    .alignment('right')
                    .fontSize(9).end,
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
            
            
            pdf.add('\n');
            // -------------------------------- Objeto
            pdf.add(docDefinition.content2);
            pdf.add('\n');
            // -------------------------------- fehca de suscripcion
            pdf.add(docDefinition.fechaSub);
            pdf.add('\n');
            if (this.valor_Contrato == '1') {
              pdf.add(docDefinition.valorContra);
            }
            pdf.add('\n');
            if (this.duracion_contrato == '1') {
              
              if(parseInt(this.duracionContrato)>12){
                pdf.add(docDefinition.duraContraDias);
  
              }else if(parseInt(this.duracionContrato)<12){
                pdf.add(docDefinition.duraContraMes);
              }
            }
            if (this.fecha_Inicio == '1') {
              pdf.add('\n');
              pdf.add(docDefinition.fechainicio);
            }
            if (this.fecha_final == '1') {
              pdf.add('\n');
              pdf.add(docDefinition.fechafin);
            }
            pdf.add('\n');
            pdf.add(docDefinition.resultadoEva);
            pdf.add('\n');
            if (this.nuevo_texto == true) {
              pdf.add(docDefinition.texTituloNovedad);
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
                      `DEL CONTRATO DE ${tipoContrato} NO`    +
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
                    'Prorroga N° ' +
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
                        ' DIAS',
                    ).bold().end,
                  );
                } else if (this.mesesProrroga[i] == '1') {
                  pdf.add(
                    new Txt(
                      'DURACIÓN:' +
                        this.diasProrroga[i] +
                        ' DIAS Y ' +
                        this.mesesProrroga[i] +
                        ' Mes',
                    ).bold().end,
                  );
                } else {
                  pdf.add(
                    new Txt(
                      'DURACIÓN:' +
                        this.diasProrroga[i] +
                        ' DIAS Y ' +
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

            pdf.add(docDefinition.firmaImagen);
            pdf.add(docDefinition.firmaPagina);
            pdf.add(
              new Txt(
                'PARA CONSTANCIA SE AÑADE LA FECHA Y HORA DE CREACIÓN:' +
                  this.horaCreacion.slice(0, 10) +
                  ' - ' +
                  this.horaCreacion.slice(11, 19),
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
                documento: response['Enlace'],
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

              this.nuxeoService
                .updateDocument$(arreglo2, this.documentoService)
                .subscribe((response) => {
                  console.log(
                    'Esta es la respuesta de la actualizacion de nuxeo',
                    response
                  );
                });
            });

            pdf
              .create()
              .download(
                'Certificacion_' +
                  this.numeroContrato +
                  '__' +
                  this.cedula +
                  '_cumplimiento',
              );
          },
          (error) => {},
        );
    });

    this.regresarInicio();
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

          this.AdministrativaJbpm.get(
            'contrato_general?query=ContratoSuscrito.NumeroContratoSuscrito:' +
              this.dataContrato[0].ContratoSuscrito +
              ',VigenciaContrato:' +
              this.dataContrato[0].Vigencia,
          ).subscribe(
            (res_Contrato) => {
              this.AdministrativaJbpm.get(
                'acta_inicio?query=NumeroContrato:' + res_Contrato[0].Id,
              ).subscribe(
                (res_Acta) => {
                  this.fechaInicio = res_Acta[0].FechaInicio;
                  this.fechaFin = res_Acta[0].FechaFin;
                },
                (err) => {},
              );
            },
            (err) => {},
          );
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
