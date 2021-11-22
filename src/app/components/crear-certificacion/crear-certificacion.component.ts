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

import pdfFonts from '../../../assets/skins/lightgray/fonts/custom-fonts';
import pdfFontTime from '../../../assets/skins/lightgray/fonts/vfs_fonts_times';
import { AdministrativaamazonService } from '../../@core/data/admistrativaamazon.service';
import { NovedadesService } from '../../@core/data/novedades.service';
import { NumerosAletrasService } from '../../@core/data/numeros-aletras.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { throwToolbarMixedModesError } from '@angular/material';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';

// Set the fonts to use

@Component({
  selector: 'ngx-crear-certificacion',
  templateUrl: './crear-certificacion.component.html',
  styleUrls: ['./crear-certificacion.component.scss'],
})
export class CrearCertificacionComponent implements OnInit {
  @ViewChild('contentTemplate', { read: false })
  contentTemplate: TemplateRef<any>;
  @Output() volverFiltro: EventEmitter<Boolean>;
  @Input() dataContrato: any = [];
  @Input() rol: string = '';
  uidDocumento: string;
  idDocumento: number;
  novedad: string;
  objeto: string;
  cedula: string;
  numeroContrato: string;
  actividadEspecifica: string = '';
  valorContrato: string;
  nombre: string;
  idTipoContrato: number;
  // los valores que tienes un _ ejemplo valor_contrato son para validar si el usuario quiere ese dato en el pdf
  valor_contrato: string;
  duracion_contrato: string;
  fecha_Inicio: string;
  fecha_final: string;
  estado_contrato: string;
  nuevo_texto: boolean = false;
  // novedadCesion: boolean = false;
  novedadOtro: boolean = false;
  // novedadSuspension: boolean = false;
  // novedadTerminacion: boolean = false;
  // ----------------------------------------------------------------------------------
  tituloNovedad: string = '';
  textoNovedad: string = '';
  fechaSuscrip: string = '';
  duracionContrato: string = '';
  idContrato: string = '';
  fechaInicio: string = '';
  fechaFin: string = ' ';
  // ---------------------Novedades----------------------------------------------------
  listaNovedades: string[] = [];
  datosNovedades: string[] = [];
  allNovedades: any[] = [];

  novedadSuspension: any[] = [];
  novedadCesion: any[] = [];
  novedadReinicio: any[] = [];
  novedadLiquidacion: any[] = [];
  novedadTerminacion: any[] = [];
  novedadAdicion: any[] = [];
  novedadProrroga: any[] = [];
  novedadAdiPro: any[] = [];
  novedadInicio: any[] = [];

  contadorSuspen: number = 0;
  contadorCesion: number = 0;
  contadorReinicio: number = 0;
  contadorModificacion: number = 0;
  contadorAdicion: number = 0;
  contadorProrroga: number = 0;
  contadorAdiPro: number = 0;
  contadorInicio: number = 0;

  tituloCesion: string = '';
  numeroNovedadesCesion: number;
  numeroNovedadesOtro: number;
  numeroNovedadesArr: string[] = [];
  numeroNovedadesArrOtro: string[] = [];
  novedadesCesion: string[] = [];
  // ----------------------------------------------------------------------------------
  duracionOtroSi: string[] = [];
  valorOtroSi: string[] = [];
  fechaInicialSupension: Date[];
  fechaFinalSuspension: Date[];
  fechaTerminacion = new Date();
  horaCreacion: string = '';

  datosTabla: any[] = [];

  contador: number = 0;

  subscription: Subscription;

  constructor(
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private NumerosAletrasService: NumerosAletrasService,
    private AdministrativaAmazon: AdministrativaamazonService,
    private NovedadesService: NovedadesService,
  ) {
    this.volverFiltro = new EventEmitter();
  }

  ngOnInit() {
    this.consultarDatosContrato();
  }
  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  crearPdf() {
    var cadena1 =
      'Que de acuerdo con la información que reposa en la carpeta contractual y en las bases de ' +
      'datos que administra la Oficina Asesora Jurídica de la Universidad Distrital Francisco José de Caldas, ';
    var cadena2 = ', identicado(a) con cédiula de ciudadanía No. ';
    var cadena3 =
      ', suscribió en esta Entidad lo siguiente:';
    var date = new Date();

    PdfMakeWrapper.setFonts(pdfFontTime, {
      TimesNewRoman: {
        normal: 'Times-Regular.ttf',
        bold: 'Times-Bold.ttf',
        italics: 'Times-Italic.ttf',
        bolditalics: 'Times-BoldItalic.ttf',
      },
    });
    PdfMakeWrapper.useFont('TimesNewRoman');
    var tipoContrato='';

    const pdf = new PdfMakeWrapper();
    if(this.idTipoContrato == 14){
      tipoContrato = 'ORDEN DE SERVICIO';

    }else if(this.idTipoContrato == 6){
      
      tipoContrato = 'PRESTACIÓN DE SERVICIOS';

    }else if(this.idTipoContrato == 7){
      tipoContrato = 'ORDEN DE VENTA';
      

    }

    pdf.pageMargins([80, 100, 60, 100]);
    pdf.styles({
      Title: {
        bold: true,
        fontSize: 10,
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
      body2: {
        fontSize: 8,
        bold: false,
        alignment: 'justify',
      },
      tabla1: {
        fontSize: 9,
        bold: true,
        alignment: 'left',
      },
      tabla2: {
        fontSize: 9,
        bold:false,
        alignment: 'justify',
      }
    });

    var docDefinition = {
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
      contentTable: [
        {
          table: {
            headerRows: 0,
            widths: [ 175, '*'],
            body: this.datosTabla,
          }
        }
      ],
      line: [
        {
          text:
            '___________________________________________________________________________________',
          style: 'body',
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
            { text: this.actividadEspecifica.toUpperCase(), style: 'body' },
          ],
        },
      ],
      valorContra: [
        {
          text: [
            { text: 'VALOR: $ ', style: 'body1', bold: true },
            {
              text: '(' + this.numeromiles(this.valorContrato) + ') ',
              style: 'body',
            },
            {
              text: this.NumerosAletrasService.convertir(parseInt(this.valorContrato)),
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
                '\n \n UNIVERSIDAD DISTRITAL \n  FRANCISCO JOSÉ DE CALDAS \n  Oficina Asesora Jurídica ',
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
                this.NumerosAletrasService.convertir(parseInt(this.duracionContrato)).slice(0, -7) +
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
                this.NumerosAletrasService.convertir(parseInt(this.duracionContrato)).slice(0, -7) +
                '(' +
                this.duracionContrato +
                ') MESES',
              style: 'body',
            },
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
      fechaSub: [
        {
          text: [
            { text: 'FECHA DE SUSCRIPCIÓN:  ', style: 'body1', bold: true },
            {
              text: this.formato(this.fechaSuscrip.slice(0, 10)),
              style: 'body',
            },
          ],
        },
      ],
      texTituloNovedad: [
        {
          text: [
            {
              text: 'Observaciones: ',
              style: 'body1',
              bold: true,
            },
            { text: this.textoNovedad.toUpperCase(), style: 'body' },
          ],
        },
      ],
      texPieDePagina: [
        {
          text: [
            {
              text:
                `Carrera 7 No. 40 B – 53 Piso 9° PBX: 3239300 
                Ext: 1911 – 1919 – 1912 Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. 
                Resolución No. 23096 del 15 de diciembre de 2016`,
              style: 'body2',
              bold: true,
            },
          ],
        },
      ],
      firmaPagina: [
        {
          text:
            '\n\n\n\nJAVIER BOLAÑOS ZAMBRANO\nJEFE OFICINA ASESORA JURÍDICA',
          style: 'body1',
          bold: true,
          alignment: 'left',
        },
      ],
      // novedadCesion: [
      //   {
      //     text: [
      //       {
      //         text:
      //           `CESIÓN DEL CONTRATO DE ${tipoContrato} NO.` +
      //           this.dataContrato[0].ContratoSuscrito +
      //           '-' +
      //           this.dataContrato[0].Vigencia,
      //         style: 'body1',
      //         bold: true,
      //       },
      //     ],
      //   },
      // ],
      
      // novedadContraTerminacion: [
      //   {
      //     text: [
      //       {
      //         text: 'NOVEDAD CONTRACTUAL:',
      //         style: 'body1',
      //         bold: true,
      //       },
      //       {
      //         text:
      //           'ACTA DE TERMINACIÓN Y LIQUIDACIÓN BILATERAL ' +
      //           this.formato(this.fechaTerminacion),
      //         style: 'body',
      //         bold: true,
      //       },
      //     ],
      //   },
      // ],
      // novedadContraSuspension: [
      //   {
      //     text: [
      //       {
      //         text: 'NOVEDAD CONTRACTUAL:',
      //         style: 'body1',
      //         bold: true,
      //       },
      //       {
      //         text:
      //           'ACTA DE SUSPENSIÓN DE ' +
      //           this.diasFecha(
      //             this.fechaInicialSupension,
      //             this.fechaFinalSuspension) +
      //           ' DIAS' +
      //           ' DESDE ' +
      //           this.formato(this.fechaInicialSupension) +
      //           ' HASTA ' +
      //           this.formato(this.fechaFinalSuspension),
      //         style: 'body',
      //         bold: true,
      //       },
      //     ],
      //   },
      // ],
      // novedadContraOtroSi: [
      //   {
      //     text: [
      //       { text: 'DURACION:  ', style: 'body1', bold: true },
      //       { text: ' DIAS ', style: 'body' },
      //       { text: '\n VALOR: $', style: 'body1', bold: true },
      //     ],
      //   },
      // ],
      contrato: [
        {
          text: [
            {
              text: `CONTRATO DE ${tipoContrato} NO. :  `,
              style: 'body1',
              bold: true,
            },
            {
              text:
                this.dataContrato[0].ContratoSuscrito +
                '-' +
                this.dataContrato[0].Vigencia,
              style: 'body',
            },
          ],
        },
      ],
      footerTable: [
        {
          table: [
            {
              text: ''
            }
          ],
          margins: [40,40]
        }
      ],
      footer: [
        {
          text: [
            {
              text: '____________________',
              style: {
                alignment: 'right',
                fontSize: 8
              }
            },
          ],
        },
      ],
      footer1: [
        {
          text: [
            {
              text: 'Línea de ateción gratuita',
              decoration: 'underline',
              style: {
                alignment: 'right',
                fontSize: 8,
              },
            },
          ],
        },
      ],
      footer2: [
        {
          text: [
            {
              text: '01  800  091  44  10',
              bold: true,
              style: {
                alignment: 'right',
                fontSize: 8
              }
            },
          ],
        },
      ],
      footer3: [
        {
          text: [
            {
              text: 
              '\n\n\nCarrera 7 No. 40 B – 53 Piso 9° PBX: 3239300 Ext: 1911 – 1919 – 1912 Bogotá D.C. – Colombia',
              style: {
                alignment: 'left',
                fontSize: 8
              }
            },
          ],
        },
      ],
      footer4: [
        {
          text: [
            {
              text: 'www.udistrital.edu.co',
              style: {
                alignment: 'right',
                fontSize: 8
              }
            }
          ]
        }
      ],
      footer5: [
        {
          text: [
            {
              text: 
              'Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016',
              style: {
                alignment: 'left',
                bold: false,
                fontSize: 8
              }
            },
          ],
        },
      ],
      footer7: [
        {
          text: [
            {
              text: 'jurídica@udistrital.edu.co',
              style: {
              alignment: 'right',
              fontSize: 8
              }
            }
          ]
        }
      ],
      firmaImagen: [
        {
          image:
            `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE
            BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ
            EBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABRAToDASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAA
            AAAAAkFBgcICgIEA//EADcQAAAGAwEAAQMDAgQCCwAAAAECAwQFBgAHCAkREhMUChUhFiIXGCMxQVEaJCcyV1iRlZbV1v/E
            ABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDv4xjGAxjGAxjGAxjGAxj
            GAxjGAxjGAxjGAxjI4fRb040F5zUGEf30JbY+8NlvArugeaNdkJMbd3TcnapWUbF1+CQBdzHwQSKzdvLWp+3CMjgOKKAP5M
            7aNcBuZujd2pOdNaWrcW8thVfV2saTGqy1nudwlEIqGi2aQfx9Syo/ccu3BxKgyj2STmQfujpNWTVw5VTSNanMfTuluxNL1
            PoLny1r3bU93NLlrFnXr9hrIyhYOXewcgsjF2iLh5YrYsjHuU2zpRkVu9RKRy0VWbqJqGgS0P5MdBehGyYLtX29nXFmkE3x
            Z/Snm5VLE/JzhoGIIqRzXQ2S0jX5UNl7Gap/6s6LpZxGrulFGs25mmYJwsZ0tRMTFQMYwhYOMj4aGimiDCMiYlk2joyOYtk
            ypNmbBgzTRas2jdIpU0G7dJNFJMpSJkKUADAqGMYwGMYwGMYwGMYwGMYwGMYwGMYwGMYwGMYwGMYwGMYwGMYwGMYwGMYwGM
            YwGMZZewNka91PVJW97RvFR11SoJud3M2y72KJq1ci26ZROZV9MzbtlHti/SUfj7q5ROP9pAMYQAQvTGQqSPunyzfJ+XpfE
            +sOlfRG3wyx2EgtyZqKXsWr4mX+hJRGPn933JWoaujQUTVKud20sMqik3Iqf4OoQETeo/anuP0C7aBUuaOR+CaU6B44Vnug
            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`,
          alignment: 'center',
          width: 200,
          absolutePosition: { x: 75, y: 700 },
        },
      ],
      escudoImagen: [
        {
          image:
            `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE
            BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ
            EBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCADrAJ8DASIAAhEBAxEB/8QAHwAAAgMBAQEBAQEBAAAAA
            AAACAkABwoGBQQDCwIB/8QAPRAAAgIDAQACAAUCAgYJBAMBBQYDBAECBwgACRESExQVFhchtwoiMTdBeBkjJDI5UViY1BhC
            caE0Q2HB/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAArEQACAQMDBAEDBQEBAAAAAAABEQACITFBUWEScYGhkSLh8DJ
            CscHR8RP/2gAMAwEAAhEDEQA/AN+HyfJ8nxEnyfJ8nxEnyfJ8nxEnyfJ8CtX68zqHtvonnh/NT317q/NQ3dPPVi7pXi0pQq
            OByB2jm9GaKGHNr+CJYTuh04p5LF3ML6d/6z9kNi0gRDU+T5Pk+IlW8l62t9kCM55YrE6tRU6Z0zlhHQrHVinkYOVuplFYL
            NbWpbuabDbRUJZsi5ZZIrMtCWvJaq1J9pK8dpfFnfVszZaOTej7X6n6mKXvf2lS0z+P4/lik7cwk4tP/wA/pEdNs/7P+9+P
            /H4zH4iT5PlAepe8hvM3AendsM1sktkpdlmXwEe2dbTY6FrEANHTqGNcZ32vtjcSDAKmI9dttZSGJM4/JHtnHVcNC9AXeO8
            zDdXZZXDp9NLAY6EySxVoMFXScfDaZZq0FOGCtAPiLzW6wyCKLGIR0NWLbbffXaTZEtX5Pk+T4iT5Pk+T4iT5Pk+T4iT5Pk
            +T4iT5Pk+T4ic22uKmhArLO7soNRW6dgbUuHmQpSDB6lkwSqBhUNokQmr1K+5ArfpDqmJptP17luvX0/GSXTXPR4zjOMZxn
            GcZx+OM4z+OM4/88Zx/hnHzw2dYXXVdOKLaFGMiuzCr4NgAGacJASZDk60lMgNI0rOkkFqncqzSwTwS6baSR77a5x8UlW7G
            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
            b4xHi0/k+T4iT5Pk+T4if/9k=`,
          alignment: 'right',
          width: 45,
        },
      ],
    };
    // -------------------------------------------------------------------------------------

    // console.log('esta es la novedad', this.novedadCesion);
    // console.log('esta es la novedad', this.listaNovedades);
    // console.log('esta es la novedad',this.valorOtroSi);
    // console.log('esta es la novedad',this.duracionOtroSi)

    // -------------------------------------------------------------------------------------

    let arreglo = [];
    let arreglo2 = [];
    let novedadesCesion = [];
    let novedadesAdicionPro = [];
    
    for ( let i = 0; i < this.datosNovedades.length; i++ ) {

    }

    // if (this.listaNovedades != null) {
    //   for (var i = 0; i < this.listaNovedades.length; i++) {
    //     if (this.listaNovedades[i] == 'cesion') {
    //       this.novedadCesion = true;
    //     }
    //     if (this.listaNovedades[i] == 'otroSi') {
    //       this.novedadOtro = true;
    //     }
    //     if (this.listaNovedades[i] == 'suspension') {
    //       this.novedadSuspension = true;
    //     }
    //     if (this.listaNovedades[i] == 'terminacionLiquidacion') {
    //       this.novedadTerminacion = true;
    //     }
    //     if (this.listaNovedades[i] == 'observaciones') {
    //       this.nuevo_texto = true;
    //     }
    //   }
    // }

    // console.log('esta es la novedad', this.novedad[1]);

    // Datos de la tabla de información del contrato
    this.datosTabla.push(
      [
        { text: 'CONTRATO N° y FECHA:', style: 'tabla1' }, 
        {
          text: this.dataContrato[0].ContratoSuscrito + '-' + this.dataContrato[0].Vigencia +
          ' - ' + this.formato(this.fechaSuscrip.slice(0, 10)), style: 'tabla2'
        }
      ]
    );

    this.datosTabla.push(
      [
        { text: 'TIPO DE CONTRATO:', style: 'tabla1' },
        { text: 'CONTRATO DE ' + tipoContrato, style: 'tabla2' }
      ]
    );

    this.datosTabla.push(
      [
        { text: 'OBJETO:', style: 'tabla1' },
        { text: this.objeto, style: 'tabla2' }
      ]
    );

    this.datosTabla.push(
      [
        { text: 'ACTIVIDADES ESPECÍFICAS:', style: 'tabla1' },
        { text: this.actividadEspecifica.toUpperCase(), style: 'tabla2' }
      ]
    );

    if (this.valor_contrato == '1') {
      this.datosTabla.push(
        [
          { text: 'VALOR DEL CONTRATO:', style: 'tabla1' },
          {
            text: this.NumerosAletrasService.convertir(parseInt(this.valorContrato)).toLowerCase() +
            '(' + this.numeromiles(this.valorContrato) + '). ',
            style: 'tabla2',
          },
        ]
      ); 
    }
    
    if (this.duracion_contrato == '1') {
      let textoDuracion = '';
      if(parseInt(this.duracionContrato)>12){
        textoDuracion = this.NumerosAletrasService.convertir(parseInt(this.duracionContrato)).slice(0, -7) +
                        '' + this.duracionContrato + ' DIAS';

      } else if(parseInt(this.duracionContrato)<12){
        textoDuracion = this.NumerosAletrasService.convertir(parseInt(this.duracionContrato)).slice(0, -7) +
                        '(' + this.duracionContrato + ') MESES';
      }
      this.datosTabla.push(
        [
          { text: 'PLAZO DEL CONTRATO:', style: 'tabla1' },
          { 
            text: 
              textoDuracion +
              ', contados a partir del acta de inicio, previo cumplimiento' +
               'de los requisitos de perfeccionamiento y ejecución, sin superar' +
               'el tiempo de la vigencia fiscal.',
            style: 'tabla2'
          }
        ]
      );
    }

    if (this.fecha_Inicio == '1') {
      this.datosTabla.push(
        [
          { text: 'FECHA DE INICIO:', style: 'tabla1' },
          { text: this.formato(this.fechaInicio.slice(0, 10)), style: 'tabla2' }
        ]
      );
    }

    for (var i = 0; i < this.novedad.length; i++) {
      
      if (this.novedad[i] == 'Cesion') {
        novedadesCesion.push(this.novedad[i]);
      } else if (this.novedad[i] == 'Adicion Prorroga') {
        novedadesAdicionPro.push(this.novedad[i]);
      }
      
      switch (this.novedad[i]) {
        case 'Suspension':
          this.datosTabla.push(
            [
              { text: 'NOVEDAD CONTRACTUAL:', style: 'tabla1' },
              {
                text:
                  'ACTA DE SUSPENSIÓN DE ' +
                  this.novedadSuspension[this.contadorSuspen].periodosuspension +
                  ' DIAS' +
                  ' DESDE ' +
                  this.formato(this.novedadSuspension[this.contadorSuspen].fechasuspension) +
                  ' HASTA ' +
                  this.formato(this.novedadSuspension[this.contadorSuspen].fechafinsuspension),
                style: 'tabla2'
              },
            ]
          );
          this.contadorSuspen++;
          break;
        case 'Cesion':
          this.datosTabla.push(
            [
              { text: 'CESIÓN:', style: 'tabla1'},
              {
                text: `N° ${this.contadorSuspen+1} del contrato de ${tipoContrato} N° ` +
                this.dataContrato[0].ContratoSuscrito +
                '-' +
                this.dataContrato[0].Vigencia + 
                '. Fecha de la cesión:' + this.formato(this.novedadCesion[this.contadorCesion].fechacesion),
                style: 'tabla2'
              } 
            ]
          );
          break;
        case 'Reinicio':
          this.datosTabla.push(
            [
              { text: 'REINICIO:', style: 'tabla1' },
              { text: 'Fecha de reinicio del contrato: ' +
                this.formato(this.novedadReinicio[this.contadorReinicio].fechareinicio), 
                style: 'tabla2'
              }
            ]
          );
          this.contadorReinicio++;
          break;
        case 'Liquidacion':
          this.datosTabla.push(
            [
              { text: 'FECHA DE LIQUIDACIÓN:', style: 'tabla1' },
              { 
                text: this.formato(this.novedadLiquidacion[0].fechaliquidacion),
                style: 'tabla2' 
              }
            ]
          );
          break;
        case 'Terminacion':
            this.datosTabla.push(
              [
                { text: 'TERMINACIÓN:', style: 'tabla1' },
                { 
                  text: this.formato(this.novedadTerminacion[0].fechaterminacionanticipada), 
                  style: 'tabla2' 
                }
              ]
            );
          break;
        case 'Adicion':
          this.contadorModificacion++;
          this.datosTabla.push(
            [
              { text: 'MODIFICACIÓN CONTRACTUAL No. ' + this.contadorModificacion, style: 'tabla1' },
              { 
                text: 
                'Se adicionó el valor de ' + this.novedadAdicion[this.contadorAdicion].valoradicion + 
                '.\n\n' + ' Fecha de la adición: ' +
                this.formato(this.novedadAdicion[this.contadorAdicion].fechaadicion.slice(0, 10)),
                style: 'tabla2' 
              }
            ]
          );
          this.contadorAdicion++;
          break;
        case 'Prorroga':
          this.datosTabla.push(
            [
              { text: 'MODIFICACIÓN CONTRACTUAL No. ' + this.contadorModificacion, style: 'tabla1' },
              { 
                text: 'Prórroga de (' + this.novedadProrroga[this.contadorProrroga].tiempoprorroga + 
                ') día(s).', style: 'tabla2' 
              }
            ]
          );
          this.contadorProrroga++;
          break;
        case 'Adicion/Prorroga':
          this.datosTabla.push(
            [
              { text: 'MODIFICACIÓN CONTRACTUAL No. ' + this.contadorModificacion, style: 'tabla1' },
              { 
                text: 'Se adicionó el valor de ' + this.novedadAdiPro[this.contadorAdiPro].valoradicion +
                '. Prórroga de (' + this.novedadAdiPro[this.contadorAdiPro].tiempoprorroga + ') día(s).', 
                style: 'tabla2'
              }
            ]
          );
          this.contadorAdiPro++;
          break;
        case 'Inicio':
          this.datosTabla.push(
            [
              { text: 'NOVEDAD INICIO: ', style: 'tabla1' },
              { 
                text: 'Fecha registro: ' + this.novedadInicio[this.contadorInicio].fecharegistro, 
                style: 'tabla2' 
              }
            ]
          );
          this.contadorInicio++;
          break;
      }

    }

    // if (this.novedadOtro == true) {
    //   for (var i = 0; i < this.duracionOtroSi.length; i++) {
    //     var contador = i + 1;
    //     this.contador = contador;

    //     this.datosTabla.push(
    //       [
    //         { text: 'MODIFICACIÓN CONTRACTUAL NO. ' + contador + ':', style: 'tabla1' },
    //         { text: 
    //           'Se adicionó el valor de ' +
    //           this.numeromiles(this.valorOtroSi[i]) +
    //           ' ' +
    //           this.NumerosAletrasService.convertir(
    //             parseInt(this.valorOtroSi[i])) + '. Prórroga de ' +
    //           this.NumerosAletrasService.convertir(
    //             parseInt(this.duracionOtroSi[i])).slice(0, -7) +
    //             this.duracionOtroSi[i] +
    //             ' días',
    //           style: 'tabla2' }
    //       ]
    //     );
        
    //     pdf.add(
    //       new Txt(
    //         'OTROSÍ N° ' +
    //           contador +
    //           ` DEL CONTRATO DE ${tipoContrato} NO ` +
    //           this.dataContrato[0].ContratoSuscrito +
    //           '-' +
    //           this.dataContrato[0].Vigencia,
    //       ).bold().end,
    //     );

    //     pdf.add(
    //       new Txt(
    //         'DURACIÓN: ' +
    //           this.NumerosAletrasService.convertir(
    //             parseInt(this.duracionOtroSi[i]),
    //           ).slice(0, -7) +
    //           this.duracionOtroSi[i] +
    //           ' DIAS',
    //       ).bold().end,
    //     );

    //     pdf.add(
    //       new Txt(
    //         'VALOR: $' +
    //           this.numeromiles(this.valorOtroSi[i]) +
    //           ' ' +
    //           this.NumerosAletrasService.convertir(
    //             parseInt(this.valorOtroSi[i]),
    //           ),
    //       ).bold().end,
    //     );
    //   }
    // }

    // if (novedadesAdicionPro.length != 0) {
      
    //   for (var i = 0; i < novedadesAdicionPro.length; i++) {
        
    //     this.contador = this.contador+1;
    //     this.datosTabla.push(
    //       [
    //         { text: 'MODIFICACIÓN CONTRACTUAL NO. ' + this.contador + ':', style: 'tabla1' },
    //         { 
    //           text:  
    //             'Se adicionó el valor de : ' + 
    //             this.numeromiles(
    //               this.allNovedades[
    //                 this.novedad.indexOf('Adicion Prorroga')
    //               ].ValorNovedad) +
    //             '  ' +
    //             this.NumerosAletrasService.convertir(
    //               parseInt(
    //                 this.allNovedades[
    //                   this.novedad.indexOf('Adicion Prorroga')
    //                 ].ValorNovedad)) + '. Prórroga de ' + 
    //                 this.NumerosAletrasService.convertir(
    //                   parseInt(
    //                     this.allNovedades[
    //                       this.novedad.indexOf('Adicion Prorroga')
    //                     ].PlazoEjecucion)).slice(0, -7) +
    //                 '(' +
    //                 this.allNovedades[this.novedad.indexOf('Adicion Prorroga')]
    //                   .PlazoEjecucion +
    //                 ')' +
    //                 ' Dias',
    //           style: 'tabla2' }
    //       ]
    //     );

    //     // pdf.add(
    //     //   new Txt(
    //     //     'OTROSÍ N° ' +
    //     //       this.contador +
    //     //       ` DEL CONTRATO DE ${tipoContrato} NO ` +
    //     //       this.dataContrato[0].ContratoSuscrito +
    //     //       '-' +
    //     //       this.dataContrato[0].Vigencia,
    //     //   ).bold().end,
    //     // );
    //     // pdf.add(
    //     //   new Txt(
    //     //     'DURACION: ' +
    //     //       this.NumerosAletrasService.convertir(
    //     //         parseInt(
    //     //           this.allNovedades[
    //     //             this.novedad.indexOf('Adicion Prorroga')
    //     //           ].PlazoEjecucion,
    //     //         ),
    //     //       ).slice(0, -7) +
    //     //       '(' +
    //     //       this.allNovedades[this.novedad.indexOf('Adicion Prorroga')]
    //     //         .PlazoEjecucion +
    //     //       ')' +
    //     //       ' Dias',
    //     //   ).bold().end,
    //     // );
    //     // pdf.add(
    //     //   new Txt(
    //     //     'VALOR: '
              
    //     //   ).bold().end,
    //     // );
    //   }

    //   // -------------------------------------
    // }

    // if (this.novedadCesion == true) {
    //   for (var i = 0; i < this.numeroNovedadesCesion; i++) {
    //     var contador = i + 1;
    //     this.datosTabla.push(
    //       [ { text: 'CESIÓN:', style: 'tabla1'},
    //         {
    //           text: 'N° ' + contador + ` DEL CONTRATO DE ${tipoContrato} NO ` +
    //           this.dataContrato[0].ContratoSuscrito +
    //           '-' +
    //           this.dataContrato[0].Vigencia,
    //           style: 'tabla2'
    //         } 
    //       ]
    //     );
    //   }
    // }

    // if (novedadesCesion.length != 0) {
    //   for (var i = 0; i < novedadesCesion.length; i++) {
    //     this.datosTabla.push(
    //       [ { text: 'CESIÓN:', style: 'tabla1'},
    //         {
    //           text: 'N° ' + contador + ` DEL CONTRATO DE ${tipoContrato} NO ` +
    //           this.dataContrato[0].ContratoSuscrito +
    //           '-' +
    //           this.dataContrato[0].Vigencia,
    //           style: 'tabla2'
    //         } 
    //       ]
    //     );
    //   }
    // } else {
    //   this.datosTabla.push(
    //     [ 
    //       { text: 'CESIÓN:', style: 'tabla1'},
    //       { text: 'N/A', style: 'tabla2' }
    //     ]
    //   );
    // }
    
    if (this.fecha_final == '1') {
      this.datosTabla.push(
        [
          { text: 'FECHA DE TERMINACIÓN:', style: 'tabla1' },
          { 
            text: this.formato(this.fechaFin.slice(0, 10)),
            style: 'tabla2'
          }
        ]
      ); 
    }

    this.datosTabla.push(
      [
        { text: 'ESTADO DEL CONTRATO:', style: 'tabla1' },
        { text: this.estado_contrato, style: 'tabla2' }
      ]
    );

    this.datosTabla.push(
      [
        { text: 'OTROS:', style: 'tabla1' },
        { text: 'N/A', style: 'tabla2' }
      ]
    );

    this.datosTabla.push(
      [
        { text: 'OBSERVACIONES:', style: 'tabla1'},
        { 
          text: 'El contrato de que trata la presente certificación no genera ' +
          'relación laboral entre el contratista y la Universidad ' +
          'Distrital Francisco José de Caldas.', 
          style: 'tabla2' }
      ]
    );

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
            '_contractual');
        file.key = file.Id;
      });
    });

    this.nuxeoService
      .getDocumentos$(arreglo, this.documentoService)
      .pipe(take(1))
      .subscribe(
        (response) => {
          // console.log('esta es la respuesta de nuxeo', response['Enlace']);
          this.horaCreacion = response['FechaCreacion'];
          
          pdf.header(
            new Table([
              [
                docDefinition.escudoImagen,
                docDefinition.valorCabe,
                new Txt('Código de autenticidad:' + response['Enlace'])
                  .bold()
                  .alignment('right')
                  .fontSize(7).end,
              ],
            ]).layout('noBorders').margin([80,5,60,0]).end,
          );
          
          // pdf.add(
          //   new Table([
          //     [
          //       docDefinition.escudoImagen,
          //       docDefinition.valorCabe,
          //       new Txt('Código de autenticidad:' + response['Enlace'])
          //         .bold()
          //         .alignment('right')
          //         .fontSize(7).end,
          //     ],
          //   ]).layout('noBorders').end,
          // );
          // pdf.add('\n');

          pdf.add(
            new Txt('EL (LA) JEFE DE LA OFICINA ASESORA JURÍDICA DE LA UNIVERSIDAD DISTRITAL ' + 
                    'FRANCISCO JOSÉ DE CALDAS, IDENTIFICADA CON EL NIT 899.999.230-7').style(
              'Title',
            ).end,
          );

          pdf.add('\n');
          pdf.add(new Txt('CERTIFICA:').style('Title').end);

          pdf.add('\n');
          // ------------------------------ se arma el primer parrafo
          pdf.add(docDefinition.content[0]);
          
          pdf.add(docDefinition.line);

          pdf.add(docDefinition.contentTable);

          // if (this.novedad == 'Sin novedades') {
          //   pdf.add(docDefinition.contrato);
          // }

          // pdf.add('\n');
          // pdf.add(docDefinition.fechaSub);

          // pdf.add('\n');
          // pdf.add(docDefinition.content2);
          // pdf.add('\n');
          // pdf.add(docDefinition.content3);
          // pdf.add('\n');
          // if (this.novedadTerminacion == true) {
          //   pdf.add(docDefinition.novedadContraTerminacion);
          // }
          // if (this.novedadSuspension == true) {
          //   pdf.add(docDefinition.novedadContraSuspension);
          // }

          // pdf.add('\n');

          // if (this.nuevo_texto == true) {
          //   pdf.add(docDefinition.texTituloNovedad);
          //   pdf.add('\n');
          // }

          pdf.add('\n\n');

          pdf.add(
            new Txt(
              'Fecha de expedición de la certificación a solicitud del interesado: ' +
                this.horaCreacion.slice(0, 10) +
                ' - ' +
                this.horaCreacion.slice(11, 19),
            )
              .alignment('left')
              .fontSize(9).end,
          );
          pdf.add(
            new Table([
              [
                {
                  unbreakable: true,
                  text: docDefinition.firmaPagina
                }
              ]
            ]).alignment('left').layout('noBorders').end
          );
          pdf.add('\n');
          pdf.add(
            new Txt(
              'El presente es un documento público expedido con firma mecánica que garantiza ' +
              'su plena validez jurídica y probatoria según lo establecido en la ley 527 de 1999.'
            ).alignment('justify').fontSize(10).bold().end
          );
          pdf.add('\n');
          pdf.add(
            new Txt(
              'Elaboró: David Eliot Iriarte - Contratista - OAJ' +
              '________________________________________________________________________________' +
              '_________________________________'
            ).fontSize(6).decoration('underline').alignment('left').end
          );

          pdf.footer(
            new Table([
              [
                docDefinition.footer3.concat(docDefinition.footer5),
                docDefinition.footer.concat(docDefinition.footer1).concat(docDefinition.footer2)
                .concat(docDefinition.footer4).concat(docDefinition.footer7)
              ],
            ]).layout('noBorders').margin([80, 0, 60, 0]).widths(['*',85]).end,
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
                  '_contractual');
              file.key = file.Id;
            });

            this.nuxeoService
              .updateDocument$(arreglo2, this.documentoService)
              .subscribe((response) => {
                /* console.log(
                'Esta es la respuesta de la actualizacion de nuxeo',
                response
              );*/
              });
          });

          pdf
            .create()
            .download(
              'Certificacion_' +
                this.numeroContrato +
                '__' +
                this.cedula +
                '_contractual',
            );
        },
        (error) => {
          this.openWindow(error);
        },
      );
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
        this.fechaSuscrip =
          res_contrato.Data[0].contrato_general.ContratoSuscrito[0].FechaSuscripcion;
        this.duracionContrato =
          res_contrato.Data[0].contrato_general.PlazoEjecucion;
        this.idContrato =
          res_contrato.Data[0].contrato_general.ContratoSuscrito[0].NumeroContrato.Id;

        this.idTipoContrato =
          res_contrato.Data[0].contrato_general.TipoContrato.Id;
        this.actividadEspecifica = res_contrato.Data[0].actividades_contrato.contrato.actividades;
        this.estado_contrato = res_contrato.Data[0].estado_contrato.contratoEstado.estado.nombreEstado;

        this.consultarNovedades();
        // console.log(this.idContrato);
        this.AdministrativaAmazon.get(
          'contrato_general?query=ContratoSuscrito.NumeroContratoSuscrito:' +
            this.dataContrato[0].ContratoSuscrito +
            ',VigenciaContrato:' +
            this.dataContrato[0].Vigencia,
        ).subscribe(
          (res_Contrato) => {
            // console.log('esta es la nueva respuesta',res_Contrato);
            this.AdministrativaAmazon.get(
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
        this.openWindow(error_service);
        this.regresarFiltro();
      };
  }
  consultarNovedades() {
    this.NovedadesService.get(
      'novedad/' + this.numeroContrato + '/' + this.dataContrato[0].Vigencia
    ).subscribe(
      (data: any) => {
        console.info('novedades: ', data[0].tiponovedad);
        this.allNovedades = data;
        
        for (let i = 0; i < data.length; i++ ) {
          switch (data[i].tiponovedad) {
            case '1':
              this.datosNovedades.push('Suspension');
              this.novedadSuspension.push(data[i]);
              break;
            case '2':
              this.datosNovedades.push('Cesion');
              this.novedadCesion.push(data[i]);
              break;
            case '3':
              this.datosNovedades.push('Reinicio');
              this.novedadReinicio.push(data[i]);
              break;
            case '4':
              this.datosNovedades.push('Liquidacion');
              this.novedadLiquidacion.push(data[i]);
              break;
            case '5':
              this.datosNovedades.push('Terminacion');
              this.novedadTerminacion.push(data[i]);
              break;
            case 6:
              this.datosNovedades.push('Adicion');
              this.novedadAdicion.push(data[i]);
              break;
            case '7':
              this.datosNovedades.push('Prorroga');
              this.novedadProrroga.push(data[i]);
              break;
            case '8':
              this.datosNovedades.push('Adicion/Prorroga');
              this.novedadAdiPro.push(data[i]);
              break;
            case '9':
              this.datosNovedades.push('Inicio');
              this.novedadInicio.push(data[i]);
              break;
          }
        }
        // this.datosNovedades.push('Sin novedades');
      },
      (err) => {
        this.datosNovedades.push('Sin novedades');
      },
    );

    // this.AdministrativaAmazon.get(
    //   'novedad_postcontractual?query=NumeroContrato:' + this.numeroContrato +
    //   ',Vigencia:' + this.dataContrato[0].Vigencia,
    // ).subscribe(
    //   (data: any) => {
    //     this.allNovedades = data;

    //     for (var i = 0; i < data.length; i++) {
    //       if (data[i].TipoNovedad == '219') {
    //         this.datosNovedades.push('Cesion');
    //       } else if (data[i].TipoNovedad == '220') {
    //         this.datosNovedades.push('Adicion Prorroga');
    //       }
    //     }
    //     this.datosNovedades.push('Sin novedades');
    //   },
    //   (err) => {
    //     500;
    //     this.datosNovedades.push('Sin novedades');
    //   },
    // );
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
  formato(texto) {
    return texto.toString().replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
  }
  openWindow(mensaje) {
    const Swal = require('sweetalert2');
    Swal.fire({
      icon: 'error',
      title: 'ERROR',
      text: mensaje,
    });
  }

  crearNovedades() {
    this.numeroNovedadesArr.length = 0;
    for (var i = 0; i < this.numeroNovedadesCesion; i++) {
      // console.log(i);
      this.numeroNovedadesArr.push('');
    }
    this.numeroNovedadesArrOtro.length = 0;
    for (var i = 0; i < this.numeroNovedadesOtro; i++) {
      // console.log(i);
      this.numeroNovedadesArrOtro.push('');
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
}
