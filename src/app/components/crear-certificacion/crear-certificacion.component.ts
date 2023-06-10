import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { PdfMakeWrapper, Table } from 'pdfmake-wrapper';
import { Txt } from 'pdfmake-wrapper';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import pdfFontTime from '../../../assets/skins/lightgray/fonts/vfs_fonts_times';
import { AdministrativaamazonService } from '../../@core/data/admistrativaamazon.service';
import { NovedadesService } from '../../@core/data/novedades.service';
import { NumerosAletrasService } from '../../@core/data/numeros-aletras.service';
import { GestorDocumentalService } from '../../@core/utils/gestor-documental.service';
import { MenuService } from '../../@core/data/menu.service';
import { IMAGENES } from './images';

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
  novedad: string[] = [];
  objeto: string;
  cedula: string;
  numeroContrato: string;
  actividadEspecifica: string = '';
  valorContrato: string;
  nombre: string;
  tipoContrato: string;
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
  otros_datos: string = '0';
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

  nombreDependencia: string = '';
  firma: string = '';
  jefeDependencia: string = '';
  emailDependencia: string = '';

  constructor(
    private gestorDocumental: GestorDocumentalService,
    private evaluacionMidService: EvaluacionmidService,
    private numerosAletrasService: NumerosAletrasService,
    private AdministrativaAmazon: AdministrativaamazonService,
    private novedadesService: NovedadesService,
    private menuService: MenuService,
  ) {
    this.volverFiltro = new EventEmitter();
  }

  ngOnInit() {
    this.consultarDatosContrato();
    this.getDependenciaEmisora();
  }

  private getDependenciaEmisora() {
    if (!!this.menuService.getAccion('Certificar no compras')) {
      this.firma = IMAGENES.firmaJuridica;
      this.jefeDependencia = 'JOHANNA CAROLINA CASTAÑO GONZALÉZ';
      this.nombreDependencia = 'Oficina Asesora Jurídica';
      this.emailDependencia = 'juridica@udistrital.edu.co';
    } else {
      this.firma = IMAGENES.firmaCompras;
      this.jefeDependencia = 'RAFAEL ENRIQUE ARANZALEZ GARCIA';
      this.nombreDependencia = 'Sección de Compras';
      this.emailDependencia = 'compras@udistrital.edu.co';
    }

  }

  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  crearPdf() {
    this.datosTabla = [];
    const cadena1 =
      'Que de acuerdo con la información que reposa en la carpeta contractual y en las bases de ' +
      'datos que administra la ' + this.nombreDependencia + ' de la Universidad Distrital Francisco José de Caldas, ';
    const cadena2 = ', identicado(a) con cédula de ciudadanía No. ';
    const cadena3 =
      ', suscribió en esta Entidad lo siguiente:';

    PdfMakeWrapper.setFonts(pdfFontTime, {
      TimesNewRoman: {
        normal: 'Times-Regular.ttf',
        bold: 'Times-Bold.ttf',
        italics: 'Times-Italic.ttf',
        bolditalics: 'Times-BoldItalic.ttf',
      },
    });
    PdfMakeWrapper.useFont('TimesNewRoman');

    const pdf = new PdfMakeWrapper();
    if (this.tipoContrato === 'Orden de Servicios') {
      this.tipoContrato = 'ORDEN DE SERVICIO';
    } else if (this.tipoContrato === 'Contrato de Prestación de Servicios Profesionales o Apoyo a la Gestión') {
      this.tipoContrato = 'PRESTACIÓN DE SERVICIOS';
    } else if (this.tipoContrato === 'Contrato de Compra-Venta') {
      this.tipoContrato = 'ORDEN DE VENTA';
    }

    const tipoContrato = this.tipoContrato.toUpperCase();
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
      contentTable: [
        {
          table: {
            headerRows: 0,
            widths: [175, '*'],
            body: this.datosTabla,
          },
        },
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
                '\n \n UNIVERSIDAD DISTRITAL \n  FRANCISCO JOSÉ DE CALDAS \n  ' + this.nombreDependencia,
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
                this.numerosAletrasService.convertir(parseInt(this.duracionContrato, 10)).slice(0, -7) +
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
                this.numerosAletrasService.convertir(parseInt(this.duracionContrato, 10)).slice(0, -7) +
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
          text: this.jefeDependencia + '\n' + this.nombreDependencia.toUpperCase(),
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
              text: '',
            },
          ],
          margins: [40, 40],
        },
      ],
      footer: [
        {
          text: [
            {
              text: '____________________',
              style: {
                alignment: 'right',
                fontSize: 8,
              },
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
                fontSize: 8,
              },
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
                fontSize: 8,
              },
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
                fontSize: 8,
              },
            },
          ],
        },
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
                fontSize: 8,
              },
            },
          ],
        },
      ],
      footer7: [
        {
          text: [
            {
              text: this.emailDependencia,
              style: {
                alignment: 'right',
                fontSize: 8,
              },
            },
          ],
        },
      ],
      escudoImagen: [
        {
          unbreakable: true,
          image: IMAGENES.escudo,
          alignment: 'right',
          width: 45,
        },
      ],
      firmaImagen: [
        {
          unbreakable: true,
          image: this.firma,
          alignment: 'left',
          width: 165,
        },
      ],
    };
    // -------------------------------------------------------------------------------------

    const arreglo2 = [];

    // Datos de la tabla de información del contrato
    this.datosTabla.push(
      [
        { text: 'CONTRATO N° y FECHA:', style: 'tabla1' },
        {
          text: this.dataContrato[0].ContratoSuscrito + '-' + this.dataContrato[0].Vigencia +
            ' - ' + this.formato(this.fechaSuscrip.slice(0, 10)), style: 'tabla2',
        },
      ],
    );

    this.datosTabla.push(
      [
        { text: 'TIPO DE CONTRATO:', style: 'tabla1' },
        { text: 'CONTRATO DE ' + tipoContrato, style: 'tabla2' },
      ],
    );

    this.datosTabla.push(
      [
        { text: 'OBJETO:', style: 'tabla1' },
        { text: this.objeto, style: 'tabla2' },
      ],
    );

    this.datosTabla.push(
      [
        { text: 'ACTIVIDADES ESPECÍFICAS:', style: 'tabla1' },
        { text: this.actividadEspecifica.toUpperCase(), style: 'tabla2' },
      ],
    );

    if (this.valor_contrato === '1') {
      this.datosTabla.push(
        [
          { text: 'VALOR DEL CONTRATO:', style: 'tabla1' },
          {
            text: this.numerosAletrasService.convertir(parseInt(this.valorContrato, 10)).toLowerCase() +
              '(' + this.numeromiles(this.valorContrato) + '). ',
            style: 'tabla2',
          },
        ],
      );
    }

    if (this.duracion_contrato === '1') {
      let textoDuracion = '';
      if (parseInt(this.duracionContrato, 10) > 12) {
        textoDuracion = this.numerosAletrasService.convertir(parseInt(this.duracionContrato, 10)).slice(0, -7) +
          '' + this.duracionContrato + ' DIAS';

      } else if (parseInt(this.duracionContrato, 10) < 12) {
        textoDuracion = this.numerosAletrasService.convertir(parseInt(this.duracionContrato, 10)).slice(0, -7) +
          '(' + this.duracionContrato + ') MESES';
      }
      this.datosTabla.push(
        [
          { text: 'PLAZO DEL CONTRATO:', style: 'tabla1' },
          {
            text:
              textoDuracion +
              ', contados a partir del acta de inicio, previo cumplimiento ' +
              'de los requisitos de perfeccionamiento y ejecución, sin superar ' +
              'el tiempo de la vigencia fiscal.',
            style: 'tabla2',
          },
        ],
      );
    }

    if (this.fecha_Inicio === '1') {
      this.datosTabla.push(
        [
          { text: 'FECHA DE INICIO:', style: 'tabla1' },
          { text: this.formato(this.fechaInicio.slice(0, 10)), style: 'tabla2' },
        ],
      );
    }

    for (let i = 0; i < this.novedad.length; i++) {

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
                style: 'tabla2',
              },
            ],
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
                  '. Fecha de la cesión: ' + this.formato(this.novedadCesion[this.contadorCesion].fechacesion.slice(0, 10)),
                style: 'tabla2',
              },
            ],
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
                style: 'tabla2',
              },
            ],
          );
          this.contadorReinicio++;
          break;
        case 'Liquidacion':
          this.datosTabla.push(
            [
              { text: 'FECHA DE LIQUIDACIÓN:', style: 'tabla1' },
              {
                text: this.formato(this.novedadLiquidacion[0].fechaliquidacion),
                style: 'tabla2',
              },
            ],
          );
          break;
        case 'Terminacion':
          this.datosTabla.push(
            [
              { text: 'TERMINACIÓN:', style: 'tabla1' },
              {
                text: this.formato(this.novedadTerminacion[0].fechaterminacionanticipada.slice(0, 10)),
                style: 'tabla2',
              },
            ],
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
                style: 'tabla2',
              },
            ],
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
                  ') día(s).', style: 'tabla2',
              },
            ],
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
                style: 'tabla2',
              },
            ],
          );
          this.contadorAdiPro++;
          break;
        case 'Inicio':
          this.datosTabla.push(
            [
              { text: 'NOVEDAD INICIO: ', style: 'tabla1' },
              {
                text: 'Fecha registro: ' + this.formato(this.novedadInicio[this.contadorInicio].fecharegistro.slice(0, 10)),
                style: 'tabla2',
              },
            ],
          );
          this.contadorInicio++;
          break;
      }

    }

    if (this.fecha_final === '1') {
      this.datosTabla.push(
        [
          { text: 'FECHA DE TERMINACIÓN:', style: 'tabla1' },
          {
            text: this.formato(this.fechaFin.slice(0, 10)),
            style: 'tabla2',
          },
        ],
      );
    }

    this.datosTabla.push(
      [
        { text: 'ESTADO DEL CONTRATO:', style: 'tabla1' },
        { text: this.estado_contrato, style: 'tabla2' },
      ],
    );

    if (this.otros_datos === '1') {
      this.datosTabla.push(
        [
          { text: 'OTROS:', style: 'tabla1' },
          { text: this.otrosDatos, style: 'tabla2' },
        ],
      );
    } else {
      this.datosTabla.push(
        [
          { text: 'OTROS:', style: 'tabla1' },
          { text: 'N/A', style: 'tabla2' },
        ],
      );
    }

    this.datosTabla.push(
      [
        { text: 'OBSERVACIONES:', style: 'tabla1' },
        {
          text: 'El contrato de que trata la presente certificación no genera ' +
            'relación laboral entre el contratista y la Universidad ' +
            'Distrital Francisco José de Caldas.',
          style: 'tabla2',
        },
      ],
    );

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
            '_contractual');
        file.key = file.Id;
      });
    }); */

    /* this.nuxeoService
      .getDocumentos$(arreglo, this.documentoService)
      .pipe(take(1))
      .subscribe(
        (response: any[]) => { */
    // console.log('esta es la respuesta de nuxeo', response['Enlace']);
    this.horaCreacion = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    pdf.add(
      new Table([
        [
          docDefinition.escudoImagen,
          docDefinition.valorCabe,
          /* new Txt('Código de autenticidad:' + "")
            .bold()
            .alignment('right')
            .fontSize(7).end, */
        ],
      ]).layout('noBorders').absolutePosition(80, 6).end,
    );

    pdf.add(
      new Txt('EL (LA) JEFE DE LA ' + this.nombreDependencia.toUpperCase() + ' DE LA UNIVERSIDAD DISTRITAL ' +
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
        'Fecha de expedición de la certificación a solicitud del interesado: ' + this.horaCreacion,
        /* this.horaCreacion.slice(0, 10) +
        ' - ' +
        this.horaCreacion.slice(11, 19), */
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
          docDefinition.firmaPagina,
        ],
      ]).alignment('left').layout('noBorders').dontBreakRows(true).end,
    );
    pdf.add('\n');
    pdf.add(
      new Txt(
        'El presente es un documento público expedido con firma mecánica que garantiza ' +
        'su plena validez jurídica y probatoria según lo establecido en la ley 527 de 1999.',
      ).alignment('justify').fontSize(10).bold().end,
    );
    pdf.add('\n');
    pdf.add(
      new Txt(
        'Elaboró: David Eliot Iriarte - Contratista - OAJ' +
        '________________________________________________________________________________' +
        '_________________________________',
      ).fontSize(6).decoration('underline').alignment('left').end,
    );

    pdf.footer(
      new Table([
        [
          docDefinition.footer3.concat(docDefinition.footer5),
          docDefinition.footer.concat(docDefinition.footer1).concat(docDefinition.footer2)
            .concat(docDefinition.footer4).concat(docDefinition.footer7),
        ],
      ]).layout('noBorders').margin([80, 0, 60, 0]).widths(['*', 85]).end,
    );

    pdf.create().getBlob((blob) => {
      const file2 = {
        IdDocumento: 16,
        file: blob,
        nombre: '',
        // documento: response[0].res.Enlace,
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

      this.gestorDocumental.uploadFiles(arreglo2)
        /* this.nuxeoService
          .updateDocument$(arreglo2, this.documentoService) */
        .subscribe((response: any[]) => {
          if (response[0].Status === '200') {
            pdf
              .create()
              .download(
                'Certificacion_' +
                this.numeroContrato +
                '__' +
                this.cedula +
                '_contractual',
              );
            this.regresarInicio();
          } else {
            this.openWindow('Fallo en carga a Gestor Documental');
          }
        },
          (error) => {
            this.openWindow(error.status + ': ' + error.message);
          });
    });


    /* },
    (error) => {
      this.openWindow(error);
    },
  );*/
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

        this.tipoContrato = res_contrato.Data[0].contrato_general.TipoContrato.TipoContrato;
        this.actividadEspecifica = res_contrato.Data[0].actividades_contrato.contrato.actividades;
        this.estado_contrato = res_contrato.Data[0].estado_contrato.contratoEstado.estado.nombreEstado;

        // this.consultarNovedades();
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
    this.novedadesService.get(
      'novedad/' + this.numeroContrato + '/' + this.dataContrato[0].Vigencia,
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
        console.info(err);
        this.datosNovedades.push('Sin novedades');
      },
    );
  }
  diasFecha(fecha1, fecha2) {
    const date_1 = new Date(fecha1.toString()).getTime();
    const date_2 = new Date(fecha2.toString()).getTime();
    // console.log(date_1, date_2);
    if (date_2 < date_1) {
      this.openWindow(
        'Error la fecha de finalizacion siempre debe ser mayor a la fecha de inicio',
      );
      this.regresarFiltro();
    } else {
      const diff = date_2 - date_1;
      return diff / (1000 * 60 * 60 * 24);
    }
  }
  formato(texto) {
    if (texto == null) {
      return '';
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
