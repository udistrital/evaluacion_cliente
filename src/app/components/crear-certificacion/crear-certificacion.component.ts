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
  novedad: string[] = [];
  objeto: string;
  cedula: string;
  numeroContrato: string;
  actividadEspecifica: string = '';
  valorContrato: string;
  nombre: string;
  idTipoContrato: number;
  fechaSuscrip: string = '';
  duracionContrato: string = '';
  idContrato: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  otrosDatos: string;
  // los valores que tienes un _ ejemplo valor_contrato son para validar si el usuario quiere ese dato en el pdf
  valor_contrato: string;
  duracion_contrato: string;
  fecha_Inicio: string;
  fecha_final: string;
  estado_contrato: string;
  otros_datos: string;
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

  numeroNovedadesCesion: number;
  numeroNovedadesOtro: number;
  numeroNovedadesArr: string[] = [];
  numeroNovedadesArrOtro: string[] = [];
  novedadesCesion: string[] = [];
  // ----------------------------------------------------------------------------------
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
    var tipoContrato = '';

    const pdf = new PdfMakeWrapper();
    if (this.idTipoContrato == 14) {
      tipoContrato = 'ORDEN DE SERVICIO';

    } else if (this.idTipoContrato == 6) {

      tipoContrato = 'PRESTACIÓN DE SERVICIOS';

    } else if (this.idTipoContrato == 7) {
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
        bold: false,
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
            widths: [175, '*'],
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
          unbreakable: true,
          text:
            'JAVIER BOLAÑOS ZAMBRANO\nJEFE OFICINA ASESORA JURÍDICA',
          style: 'body1',
          bold: true,
          alignment: 'left',
        },
      ],
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
          margins: [40, 40]
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
      escudoImagen: [
        {
          unbreakable: true,
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
      firmaImagen: [
        {
          unbreakable: true,
          image:
            `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFE
          RAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCA
          gKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD
          AwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAIgA3kDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcI
          CQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJic
          oKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztL
          W2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFB
          gcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcY
          GRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKm
          qsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAoo
          ooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAo
          oooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA
          ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig
          AooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiii
          gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACii
          igAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi
          iigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAC
          iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKA
          CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKK
          ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK
          KACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKK
          KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK
          KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA
          KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo
          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
          IPwnvJNCh+0WY1y/hDc/8s5/aum/ZQ/4NVNP8Z+Kx8Qv2nPG+qePfGOsOb2+0qI7Uz6E/wCAwK/Xz4UfBXwn8DvDUOieD/D
          +l+G9Jtv9XbWVsI1FAH43/Av/AINlvid+1br6+Mf2uvi7rniK8ui8kuiWN9JIq+mT0/Kv1G/ZP/4JxfBf9ijRI7fwB4E0HR
          J408t75bVPtE31bFe7UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHj3xJ/Z8uoNd1Dxf8PbyP
          w54wmg8qSExD7Fqnl/cEqdM9t4qz+z7+0pa/FtToetWTeFfHOnqft2hzN+8XZ1eM/xx+9esV5P+0l+z8vxLsY/EGg/YdN8f
          aLsk0rVHj3NEVcN5f0fBTn1oA9YoryD9kz9puz/aL8OXkF5FHp/i/wANulrrmmCTcLWUr99PVG5xXr9ABRRRQAUUUUAFFFF
          ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFfL//AAVm/wCCh2kf8E
          0P2NvEXxCvHhm1jZ9i0GxP/L/et0H9f/119QV/Ov8AtmeINU/4OHP+C3WmfBvSriSL4PfCe6uIr26iwMxqcXU4z/ESAo/+u
          KAPqT/g2W/YB1e803XP2tPim02ofEn4qS3E2mSXh/eQ2jnluf72MdOg9q/YSsXwh4M0z4e+E9O0XR7WKx0nSbZLO0t1/wBX
          CkfCAVtUAFFFFABRRRQB+B3/AAeR/sx3mieIPhh8dNF3Ca1dtDvJIzyOpX/D8TX6u/8ABJf9qyz/AGxv+Cenwz8dQO8lxNp
          Ednecf8vFunlyfy/WuL/4LxfswN+1Z/wTA+Jmg2tlHeatYWB1HTB3EsfPH4E/lXwz/wAGbX7Vv/Cafs2eMvhLfAfaPB9+b+
          2/3HIB/UD8qAP2uooooAKo6zq1roenSXV9NDa2tsnmSSySbEjHuamu7yOwtZJ5XSOGNN7v2FfkV/wUw/bM+JH/AAUw+N9x+
          zT+zjeXOnaNC/l+LfFMXQfx+QlAHs37Vn/BULxV+0V48k+EH7NFjJrev3d19h1TxL/y76TH/G6V3f8AwT1/4I1+C/2UtvjD
          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
          8rf8FX/+Cbfhn/gpF+zTq/hu+jWHXI7cyadeDqjdcV+Rv/BDb/gol4q/4JcftQ6h+zX8c7ubTdB3+Vo8tyPuHtj/AD61/Q3
          X5Yf8HGH/AASEj/ay+DE/xJ8C6csXxF8Nn7X5qHDSgY5oA/UXTtRg1K0juLeSOaG4TzI3TpIKtV+R3/BuB/wWNH7QfgH/AI
          Un8TLqWx+JHhFTEHutkf2iNe31r9caACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKA
          CiiigAooooAKKKKACo5p1t4mkkby44+pqSvkH/guj+1G/7IP/BMr4leKLO6jstWvLE6Rp8h/wCe1x8v8s0Afmb/AME9xqX/
          AAUy/wCDmn4lfGHzDN4R+D73NvZyMevl5tbdF9+tfvhX5R/8GlP7K6/Br/gnhcfELUlX+3Pihqs1+0n/AE7JgL+eCfwr9XK
          ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK
          KACiiigAr+VT9u7X9L8Ef8HFWn3l4I/ssOvWSXP+/J/wDrr+p/XL1tO0i6lj/1kUTSAfSv47f2nPF1z8W/+C2uqX0redJ/w
          mdvGD/sR4/woA/sK8LXcN34Z0+4t2jkhkgR4zH0PyVqVx/wMK/8KX8MrG3mL/Z8QB9fkrsKACiiigArP1zWrHw7pc15qNzD
          a2tqvmSSSSYEYrL+J/xU0H4N+C7vXvEWpWum6fZp5kks0gQV+Cf/AAVE/wCCsXxN/wCCnfxRk+DXwBtNQ/sGaf7Fe6rZH93
          Gm/ZJmgD3b/gqF/wcRx6l48k+DfwLtJPEPiPUJPsU95H2rU/4Jq/8EBrPxP40s/jB8aEutR8UXQ85Irk/3q9Q/wCCOP8Awb
          9eD/2GNHTxV4rX/hIfGeoJvkkl/hr9MoIkto/LRfLjj6CgCl4b8NWHhLRrfT9NtYrWztU8uOOMcRitGiigAooooAKKKKACi
          iigAooooAKKKKACiiigDzP9sLRW8Q/sr+PrJPv3GjXIH/fJP9K/Af8A4NMd+gf8FIfihYvLz5DDHr8z1/RN8SrQX/w/16D/
          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
          13XrTw5o82oX00cNjax+ZJI/YUAQ+LvGOm+BPDtxq2rXcVjp1om+WWTgKK/E3/gqT/wUl8cft2/FSD4X/A+aX+y/tSW15eR
          Vqf8ABQ3/AIKXeJ/2+/j9Z/Bz4Ux6xD4fWTy766sRyx96+yv+CUP/AAR38K/sFaC+rzL9q8UaltuJW/umgCv/AMErf+CReg
          /sieC9P17xVY2OoeMpN8rP/rAvmV+aH/Bxz8VYPH//AAUy+FngPS54ZoNPvxLNbj171/Qf4j1ZdC0O7vJNn+iwtJX8u+j+E
          dW/4KBf8HDWq3dnD/aNlpWu5PoAP/1mgD+l39mrwyPBX7P/AIN0v+Kz0qBfx2A/1ru6qaZp0ekabb2sY/dWyLGn4cVboAKK
          KKAPHdEnTwB+0Q9izQ2tvr8RMMccWzzSOlexV5f8erS30PXNB1xo5jcW9xt/d16RZ3UeoWyywyRyQyjejp0NAFiiiigAooo
          oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo
          ooAKKKKACiiigDF8VeBdD8awtHrGl6fqMcg8vE8Qkz7dK+P/2k/wDggL+zP+0ldPeal4B0mxvJAx860j8t8+1fbVFAH4Q/H
          /8A4MvtBv5bub4e/EPULBTzFb6gizA/jxXyT43/AODTr9qL4RyTXXhfXNE1Qw8o9pcTWZNf1KUUAfyj+HP+CVX/AAUS+Etq
          8mj3XjKzhhf/AFcPiOSsOXwN/wAFKu7fF7/wPg/xr+tSmeSv/PNPyoA/kOu/2dv+ChXjKZ7O4sfjLdeV1Empcfzq94d/4Iz
          ft2fGHTm3aB42+y6p/rE1PxCfn+vJr+uKG2SAfu40T6CpKAP5aPC3/BpJ+1H4y06G+1fUvCWnS9Qst5NcsP0r6H+D/wDwZW
          6uf3vjv4rQr/0z0i0/xr+hCigD85/2Wf8Ag2O/Zh/ZtEdxe+E/+E31Ic+Zrh+0AV9yfDL9n3wT8F9Ch0/wv4W0PRLS1H7uO
          1tEjxXaUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFA
          BRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAFXVNTh0aymurpkhtbdPMeRv4RX48f8FQv+Cqmo/tMfFm++A/w3F8LW8/0a51CKJ
          +a93/AOCtX7ed9JJ/wqfwGJNQvtcTyrye1kxJD/uPW5/wSU/4JXaf+zv4f/4S7xTDNe+INSj4jvov3kHz76ANT/gkR/wSy0
          39jrwrJ4k1cTXniTVhnF7+8kta+6qKKAPln/gsL+1Kn7In7CHjPxX5Ec1zb2TiOE96/ID/AIND/g5J8V/2i/iB8TNSh5hdn
          U+hP/1zXsP/AAeOfH2fTPg94N8A2V15cmpXqNJGO9fU3/Bsp+yXefsz/wDBPHS7jV7TydX8RSfbpB7UAfo9RRRQAUUUUAcX
          8dfB8njL4dX0FvgXkI8y3f0NUf2bNZvtT+FVkmpTC5vLL/R2YDrjpXfzR+dHivGPg3400/wv8ZNc8IvN9lldvOggk6y/SgD
          2qiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK
          KACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKK
          KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr5r/b1/adf4aaBJ4V0P994
          i1OPy3H/ADxjk719GajLJZ6fI8EfmSRp8ieteG+E/wBnKH4i+NU8WeJLXzm+fyo5f9YE/uUAeX/sQfsGWNjBb+N/HWnRTa/
          NI9wiSnzPM/6aPX2VTIY/JjxT6ACiiuH+P/j2x+GPwT8R61e3kenQWthIfPP/ACzOw4/KgD+bP/guv8X/APhrz/gs/wCDfB
          nneda+HrqO0/77k8z+lf0pfs/eEI/h/wDA/wAJ6LDH5KWOlwRBP7n7sGv5jv8Aglv8BNW/4KD/APBarXvGLyWeq6PYa3czz
          XZPyn0I/A/rX9TlvFHZWqRx/wCrjGzFAE9FFFABRRRQAV+X/wDwXv8AHfij9iy00n44eGLexuG0idJJhl0lCr9K/UCuB/aM
          /Z68NftPfCLVfBvinTbXUtN1aBoXW5i8wD3oA8f/AOCYH/BTbwV/wUx+BMPibw7cW0WtWccY1bTY5fMks5DX09X83n7R3/B
          Ir9pn/gjR8fLj4ifs5XWraz4amut5sLXnI9COh/z9K/Yf/gk1+3l40/bW+BlvN8SvAupeB/GVgnl3cEqukVwfUUAfXlFFFA
          BRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFF
          ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFF
          FABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV+eP/By7+0PqHwJ/4Jn+KP7
          JdobzVSLVXA4Ar9Dq/C//AIO2f2o9P1K18J/B+3kjM2tXduspHYFv/rgUAR/8GYnwfvLH4WePvGF5a4t7i4ENjIe/r/Wv3U
          r47/4Ibfs0W/7MH/BPzwfpMdvbwzX0H2qV4v4s19iUAFFFFABRRRQAUUUUAV7i2S9haOZUkjk/gcU3S9LtdHtRBaW8NrEOi
          RpsFWqKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAo
          oooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA
          ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAjmmW3hZ34S
          Pk1/KP/wAFkfia/wC13/wXM03Q7KbzBZ6vYaPx/f8AP3yV/T9+0z4/j+FvwN8Sa5I3lfZbRjmv5ef+CLHwmuP23v8Agtdde
          KLyx/tDS4devNcuc/7U9AH9S3wO8Mx+Bvg74b0mOOOKOxsI4gidBx2/OuuqOKIQRKi9BUlABRRRQAUUUUAFFFFABRRRQAUU
          UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU
          UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA
          UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHyL/AMFtPiBP8Pv+Cf8A4
          4uLUsbiTTpwscf35OB0r84/+DPD9mlNJ8J+MPHF3bxi6nmCA+npX0N/wdJ/FtPB/wCydp2h/wDLXW5VH6mvdP8Aggd8Jk+H
          f7Bfh++2oJNdRbkkfSgD7cooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKK
          ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK
          KACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKK
          KKACiiigAooooAKKKKACiiigAooooA/E7/g40+J2leMf2hPB/gu8k/1MiV+rv7G/wAN7H4Tfs0eEtKsI/JghsI5NnuUr8t/
          +CjHwpvvil/wVD8Lvb2n9oQw6gkU4H7zH7zfX7EeENLTRfC+n2kcflRQW6RhPTigDUooooAKKKKACiiigAooooAKKKKACii
          igAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi
          iigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAC
          iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApr9KdRQB+dPxM/Zm1rTP8AgpR4
          f1qS2kms7u982MyxeZ/wNK/Ras3VfDlnq09vLNCrXEDb4m7xmtKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKA
          CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKK
          ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK
          KACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKK
          KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK
          KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA
          KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo
          AKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooo
          oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo
          ooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAo
          oooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA
          ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig
          AooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==`,
          alignment: 'left',
          width: 165,
        },
      ],
    };
    // -------------------------------------------------------------------------------------

    let arreglo = [];
    let arreglo2 = [];

    for (let i = 0; i < this.datosNovedades.length; i++) {

    }

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
      if (parseInt(this.duracionContrato) > 12) {
        textoDuracion = this.NumerosAletrasService.convertir(parseInt(this.duracionContrato)).slice(0, -7) +
          '' + this.duracionContrato + ' DIAS';

      } else if (parseInt(this.duracionContrato) < 12) {
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

      switch (this.novedad[i]) {
        case 'Suspension':
          this.datosTabla.push(
            [
              { text: 'NOVEDAD CONTRACTUAL:', style: 'tabla1' },
              {
                text:
                  'ACTA DE SUSPENSIÓN DE ' +
                  this.formato(this.novedadSuspension[this.contadorSuspen].periodosuspension) +
                  ' DIAS' +
                  ' DESDE El ' +
                  this.formato(this.novedadSuspension[this.contadorSuspen].fechasuspension.slice(0, 10)) +
                  ' HASTA El ' +
                  this.formato(this.novedadSuspension[this.contadorSuspen].fechafinsuspension.slice(0, 10)),
                style: 'tabla2'
              },
            ]
          );
          this.contadorSuspen++;
          break;
        case 'Cesion':
          this.datosTabla.push(
            [
              { text: 'CESIÓN:', style: 'tabla1' },
              {
                text: `N° ${this.contadorCesion + 1} del contrato de ${tipoContrato} N° ` +
                  this.dataContrato[0].ContratoSuscrito +
                  '-' +
                  this.dataContrato[0].Vigencia +
                  '. Fecha de la cesión: ' + this.formato(this.novedadCesion[this.contadorCesion].fechacesion.slice(0,10)),
                style: 'tabla2'
              }
            ]
          );
          this.contadorCesion++;
          break;
        case 'Reinicio':
          this.datosTabla.push(
            [
              { text: 'REINICIO:', style: 'tabla1' },
              {
                text: 'Fecha de reinicio del contrato: ' +
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
                text: this.formato(this.novedadTerminacion[0].fechaterminacionanticipada.slice(0,10)),
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
                  'Se adicionó el valor de ' + this.numeromiles(this.novedadAdicion[this.contadorAdicion].valoradicion) +
                  '.\n\n' + ' Fecha de la adición: ' +
                  this.formato(this.novedadAdicion[this.contadorAdicion].fechaadicion.slice(0, 10)),
                style: 'tabla2'
              }
            ]
          );
          this.contadorAdicion++;
          break;
        case 'Prorroga':
          this.contadorModificacion++;
          this.datosTabla.push(
            [
              { text: 'MODIFICACIÓN CONTRACTUAL No. ' + this.contadorModificacion, style: 'tabla1' },
              {
                text: 'Prórroga de (' + this.formato(this.novedadProrroga[this.contadorProrroga].tiempoprorroga) +
                  ') día(s).', style: 'tabla2'
              }
            ]
          );
          this.contadorProrroga++;
          break;
        case 'Adicion/Prorroga':
          this.contadorModificacion++;
          this.datosTabla.push(
            [
              { text: 'MODIFICACIÓN CONTRACTUAL No. ' + this.contadorModificacion, style: 'tabla1' },
              {
                text: 'Se adicionó el valor de ' + this.numeromiles(this.novedadAdiPro[this.contadorAdiPro].valoradicion) +
                  '. Prórroga de (' + this.formato(this.novedadAdiPro[this.contadorAdiPro].tiempoprorroga) + ') día(s).',
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
                text: 'Fecha registro: ' + this.formato(this.novedadInicio[this.contadorInicio].fecharegistro.slice(0,10)),
                style: 'tabla2'
              }
            ]
          );
          this.contadorInicio++;
          break;
      }

    }

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

    if (this.otros_datos == '1') {
      this.datosTabla.push(
        [
          { text: 'OTROS:', style: 'tabla1' },
          { text: this.otrosDatos, style: 'tabla2' }
        ]
      );
    } else {
      this.datosTabla.push(
        [
          { text: 'OTROS:', style: 'tabla1' },
          { text: 'N/A', style: 'tabla2' }
        ]
      );
    }

    this.datosTabla.push(
      [
        { text: 'OBSERVACIONES:', style: 'tabla1' },
        {
          text: 'El contrato de que trata la presente certificación no genera ' +
            'relación laboral entre el contratista y la Universidad ' +
            'Distrital Francisco José de Caldas.',
          style: 'tabla2'
        }
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

          pdf.add(
            new Table([
              [
                docDefinition.escudoImagen,
                docDefinition.valorCabe,
                new Txt('Código de autenticidad:' + response['Enlace'])
                  .bold()
                  .alignment('right')
                  .fontSize(7).end,
              ],
            ]).layout('noBorders').absolutePosition(80, 6).end,
          );

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
                docDefinition.firmaImagen,
              ],
              [
                docDefinition.firmaPagina
              ]
            ]).alignment('left').layout('noBorders').dontBreakRows(true).end
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
            ]).layout('noBorders').margin([80, 0, 60, 0]).widths(['*', 85]).end,
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
              (err) => { },
            );
          },
          (err) => { },
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
        this.allNovedades = data;
        console.info(this.allNovedades);
        this.datosNovedades.push('Sin novedades');
        for (let i = 0; i < data.length; i++) {
          switch (data[i].tiponovedad) {
            case 1:
              this.datosNovedades.push('Suspension');
              this.novedadSuspension.push(data[i]);
              break;
            case 2:
              this.datosNovedades.push('Cesion');
              this.novedadCesion.push(data[i]);
              break;
            case 3:
              this.datosNovedades.push('Reinicio');
              this.novedadReinicio.push(data[i]);
              break;
            case 4:
              this.datosNovedades.push('Liquidacion');
              this.novedadLiquidacion.push(data[i]);
              break;
            case 5:
              this.datosNovedades.push('Terminacion');
              this.novedadTerminacion.push(data[i]);
              break;
            case 6:
              this.datosNovedades.push('Adicion');
              this.novedadAdicion.push(data[i]);
              break;
            case 7:
              this.datosNovedades.push('Prorroga');
              this.novedadProrroga.push(data[i]);
              break;
            case 8:
              this.datosNovedades.push('Adicion/Prorroga');
              this.novedadAdiPro.push(data[i]);
              break;
            case 9:
              this.datosNovedades.push('Inicio');
              this.novedadInicio.push(data[i]);
              break;
          }
        }
      },
      (err) => {
        console.log(err);
        this.datosNovedades.push('Sin novedades');
      },
    );
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
    if (texto == null) {
      return "";
    } else {
      return texto.toString().replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
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
