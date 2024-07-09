import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PdfMakeWrapper, Table } from 'pdfmake-wrapper';
import { Txt } from 'pdfmake-wrapper';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';
import pdfFontTime from '../../../assets/skins/lightgray/fonts/vfs_fonts_times';
import { AdministrativaamazonService } from '../../@core/data/admistrativaamazon.service';
import { NovedadesService } from '../../@core/data/novedades.service';
import { NumerosAletrasService } from '../../@core/data/numeros-aletras.service';
import { GestorDocumentalService } from '../../@core/utils/gestor-documental.service';
import { FirmaElectronicaService } from '../../@core/utils/firma_electronica.service';
import { MenuService } from '../../@core/data/menu.service';
import { IMAGENES } from '../images';
import * as moment from 'moment';

@Component({
  selector: 'ngx-crear-certificacion',
  templateUrl: './crear-certificacion.component.html',
  styleUrls: ['./crear-certificacion.component.scss'],
})
export class CrearCertificacionComponent implements OnInit {
  @Output() volverFiltro: EventEmitter<Boolean>;
  @Input() dataContrato: any = [];

  novedad: string[] = [];
  objeto: string;
  cedula: string;
  actividadEspecifica: string = '';
  valorContrato: string;
  nombre: string;
  tipoContrato: string;
  duracionContrato: number = 0;
  valorPorDia: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  otrosDatos: string;
  estadoContrato: string;
  // los valores que tienes un _ ejemplo valor_contrato son para validar si el usuario quiere ese dato en el pdf
  valor_contrato: string;
  duracion_contrato: string;
  fecha_Inicio: string;
  fecha_final: string;
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

  numeroNovedadesCesion: number;
  numeroNovedadesOtro: number;
  numeroNovedadesArr: string[] = [];
  numeroNovedadesArrOtro: string[] = [];
  novedadesCesion: string[] = [];

  firmantes: any = undefined;
  // ----------------------------------------------------------------------------------
  datosTabla: any[] = [];

  horaCreacion: string = '';
  nombreDependencia: string = '';
  firma: string = '';
  jefeDependencia: string = '';
  emailDependencia: string = '';
  user: string = '';
  seleccionarOtros: boolean = false;

  constructor(
    private firmaElectronica: FirmaElectronicaService,
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
    this.consultarFirmantes();
    this.getDependenciaEmisora();
    this.getUsuario();
  }

  private getUsuario() {
    this.user = 'Julio César Otálora Neisa';
  }

  private getDependenciaEmisora() {
    this.seleccionarOtros = !!this.menuService.getAccion('Seleccionar otros contractual');
    this.jefeDependencia = 'DIANA XIMENA PIRACHICÁN MARTÍNEZ';
    this.firma = IMAGENES.firma;
    this.nombreDependencia = 'Oficina de Contratación';
    this.emailDependencia = 'juridica@udistrital.edu.co';
  }

  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  crearPdf() {
    this.datosTabla = [];
    const cadena1 = 'Que de acuerdo con la información que reposa en la carpeta contractual y en las bases de datos que administra la '
      + this.nombreDependencia + ' de la Universidad Distrital Francisco José de Caldas, ';
    const cadena2 = ', identicado(a) con cédula de ciudadanía No. ';
    const cadena3 = ', suscribió en esta Entidad lo siguiente:';

    if (this.tipoContrato === 'Orden de Servicios') {
      this.tipoContrato = 'ORDEN DE SERVICIO';
    } else if (this.tipoContrato === 'Contrato de Prestación de Servicios Profesionales o Apoyo a la Gestión') {
      this.tipoContrato = 'PRESTACIÓN DE SERVICIOS';
    } else if (this.tipoContrato === 'Contrato de Compra-Venta') {
      this.tipoContrato = 'ORDEN DE VENTA';
    }

    const tipoContrato = this.tipoContrato.toUpperCase();
    const filasNovedades = this.procesarNovedades(tipoContrato);
    this.contarDias();

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
    pdf.pageMargins([80, 100, 60, 60]);
    pdf.header({
      layout: 'noBorders',
      margin: [80, 0, 0, 0],
      table: {
        body: [
          [
            [
              {
                image: IMAGENES.escudo,
                alignment: 'right',
                width: 45,
              },
            ],
            [
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
          ],
        ],
      },
    });

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
      subtitle: {
        fontSize: 9,
        alignment: 'justify',
      },
      tabla1: {
        fontSize: 9,
        bold: true,
        alignment: 'left',
      },
      tabla2: {
        fontSize: 8,
        bold: false,
        alignment: 'justify',
      },
    });

    const docDefinition = {
      content: {
        text: [
          { text: cadena1, style: 'subtitle' },
          { text: this.nombre, style: 'subtitle', bold: true },
          { text: cadena2, style: 'subtitle' },
          { text: this.cedula, style: 'subtitle', bold: true },
          { text: cadena3, style: 'subtitle' },
          { text: '', style: 'subtitle' },
        ],
      },
      contentTable: [
        {
          table: {
            headerRows: 0,
            widths: ['38%', '62%'],
            body: this.datosTabla,
          },
        },
      ],
      line: [
        {
          text:
            '\n',
          style: 'body',
        },
      ],
      firmaPagina: [
        {
          text: this.jefeDependencia + '\n' + this.nombreDependencia.toUpperCase(),
          style: 'body1',
          bold: true,
          alignment: 'left',
        },
      ],
      firmaImagen: [
        {
          image: this.firma,
          alignment: 'left',
          width: 165,
        },
      ],
    };
    // -------------------------------------------------------------------------------------

    // Datos de la tabla de información del contrato
    this.datosTabla.push(
      [
        { text: 'CONTRATO N° y FECHA:', style: 'tabla1' },
        {
          text: this.dataContrato[0].ContratoSuscrito + '-' + this.dataContrato[0].Vigencia +
            ' - ' + this.formato(this.fechaInicio.slice(0, 10)), style: 'tabla2',
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
              '($' + this.numeromiles(this.valorContrato) + '). ',
            style: 'tabla2',
          },
        ],
      );
    }

    if (this.duracion_contrato === '1') {
      let textoDuracion = '';
      const meses = Math.trunc(this.duracionContrato / 30);
      const dias = this.duracionContrato % 30;

      if (meses > 0) {
        textoDuracion = this.numerosAletrasService.convertir(meses).slice(0, -7) + '(' + meses + ') mes(es)';
      }
      if (dias > 0) {
        if (meses > 0) {
          textoDuracion += ' y ';
        }
        textoDuracion += this.numerosAletrasService.convertir(dias).slice(0, -7) + '(' + dias + ') día(s)';
      }
      this.datosTabla.push(
        [
          { text: 'PLAZO DEL CONTRATO:', style: 'tabla1' },
          {
            text: textoDuracion + ', contados a partir del acta de inicio, ' +
              'previo cumplimiento de los requisitos de perfeccionamiento y ejecución, sin superar el tiempo de la vigencia fiscal.',
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

    this.datosTabla.push(...filasNovedades);

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
        { text: this.estadoContrato, style: 'tabla2' },
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
          text: 'El contrato de que trata la presente certificación no genera relación laboral entre ' +
            'el contratista y la Universidad Distrital Francisco José de Caldas.',
          style: 'tabla2',
        },
      ],
    );

    this.horaCreacion = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

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
    pdf.add(docDefinition.content);

    pdf.add(docDefinition.line);

    pdf.add(docDefinition.contentTable);

    pdf.add('\n\n');

    const filasFirma = {
      stack:
        [
          { text: 'Fecha de expedición de la certificación a solicitud del interesado: ' + this.horaCreacion, style: 'subtitle' },
          /* { text: '\n' },
          docDefinition.firmaImagen,
          docDefinition.firmaPagina,
          { text: '\n' },
          {
            text: 'El presente es un documento público expedido con firma mecánica que garantiza su plena validez jurídica y ' +
              'probatoria según lo establecido en la ley 527 de 1999.\n',
            style: 'body1',
          }, */
          { text: '\n' },
        ],
      unbreakable: true,
    };

    pdf.add(filasFirma);
    pdf.add(
      new Txt(
        'Elaboró: ' + this.user + ' - Contratista' +
        '                                                                                                                                         ' +
        '                                                                                           ',
      ).fontSize(6).decoration('underline').alignment('left').end,
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
          margin: [80, 0, 0, 0],
        },
        {
          stack: [
            { text: 'Línea de atención gratuita', decoration: 'underline' },
            { text: '01  800  091  44  10', bold: true },
            { text: 'www.udistrital.edu.co' },
            { text: 'procesoscontratacion@udistrital.edu.co' },
            { text: 'tramitescontratacion@udistrital.edu.co' },
          ],
          width: '35%',
          alignment: 'right',
          fontSize: 8,
          margin: [0, 0, 60, 0],
        },
      ],
    });

    const arreglo2 = [];
    pdf.create().getBlob((blob) => {
      const file2 = {
        IdDocumento: 16,
        file: blob,
        nombre: '',
        firmantes: [],
        representantes: [],
        // documento: response[0].res.Enlace,
      };
      arreglo2.push(file2);
      arreglo2.forEach((file) => {
        (file.Id = file.nombre),
          (file.nombre = 'certificacion_' + file.Id + this.dataContrato[0].ContratoSuscrito + '__' + this.cedula + '_contractual');
        file.key = file.Id;
        file.firmantes.push(this.firmantes);
      });

      this.firmaElectronica.uploadFilesElectronicSign(arreglo2)
        .subscribe((response: any[]) => {
          if (response[0].Status === '200') {
            this.gestorDocumental.getByUUID(response[0].res.Enlace)
              .subscribe((file) => {
                this.download(file, '', 1000, 1000);
              });
            this.regresarInicio();
          } else {
            this.openWindow('Fallo en carga a Gestor Documental');
          }
        },
          (error) => {
            this.openWindow(error.status + ': ' + error.message);
          });
    });

  }

  private downloadBlob(blob: any): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = 'Certificacion_' + this.dataContrato[0].ContratoSuscrito + '__' + this.cedula + '_contractual';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  private contarDias() {
    const fechaInicio = moment(this.fechaInicio.slice(0, 10) + 'T12:00:00Z');
    const fechaFin = moment(this.fechaFin.slice(0, 10) + 'T12:00:00Z');
    const monthDiff = fechaFin.clone().add(1, 'days').diff(fechaInicio, 'months');
    const fechaFinSub = fechaFin.clone().subtract(monthDiff, 'month');
    let diasMesUltimo = fechaFinSub.date();
    let diasMesInicial = fechaInicio.date();
    if (diasMesUltimo === fechaFinSub.daysInMonth()) {
      diasMesUltimo = 30;
    }

    if (diasMesInicial === fechaInicio.daysInMonth()) {
      diasMesInicial = 30;
    }

    let dias = diasMesUltimo - diasMesInicial + 1;
    if (dias < 0) {
      dias += 30;
    }
    this.duracionContrato = monthDiff * 30 + dias;
  }

  private procesarNovedades(tipoContrato: string) {
    let contadorSuspen: number = 0;
    let contadorCesion: number = 0;
    let contadorReinicio: number = 0;
    let contadorModificacion: number = 0;
    let contadorAdicion: number = 0;
    let contadorProrroga: number = 0;
    let contadorAdiPro: number = 0;
    let contadorInicio: number = 0;
    let fechaProrroga: Date;

    const filasNovedades = [];
    const filasProrroga = [];
    const style = 'tabla1';

    const textModificacion = 'MODIFICACIÓN CONTRACTUAL No.';

    for (let i = 0; i < this.novedad.length; i++) {
      switch (this.novedad[i]) {
        case 'Suspensión':
          filasNovedades.push(
            [
              { text: 'NOVEDAD CONTRACTUAL:', style },
              {
                text:
                  'ACTA DE SUSPENSIÓN DE ' +
                  this.formato(this.novedadSuspension[contadorSuspen].periodosuspension) +
                  ' DIAS' +
                  ' DESDE El ' +
                  this.formato(this.novedadSuspension[contadorSuspen].fechasuspension.slice(0, 10)) +
                  ' HASTA El ' +
                  this.formato(this.novedadSuspension[contadorSuspen].fechafinsuspension.slice(0, 10)),
                style: 'tabla2',
              },
            ],
          );
          contadorSuspen++;
          break;
        case 'Cesión':
          const cedente = this.novedadCesion[contadorCesion].cedente;
          if (this.dataContrato[0].IdProveedor === cedente) {
            const fechaCesion = new Date(this.novedadCesion[contadorCesion].fechacesion);
            fechaCesion.setTime(fechaCesion.getTime() - 24 * 60 * 60 * 1000);
            filasNovedades.push(
              [
                { text: 'CESIÓN:', style },
                {
                  text: `N° ${contadorCesion + 1} del contrato de ${tipoContrato} N° ` +
                    `${this.dataContrato[0].ContratoSuscrito} - ${this.dataContrato[0].Vigencia}. ` +
                    'Fecha de la cesión: ' + this.formato(this.novedadCesion[contadorCesion].fechacesion.slice(0, 10)),
                  style: 'tabla2',
                },
              ],
            );
          }
          contadorCesion++;
          break;
        case 'Reinicio':
          filasNovedades.push(
            [
              { text: 'REINICIO:', style },
              {
                text: 'Fecha de reinicio del contrato: ' +
                  this.formato(this.novedadReinicio[contadorReinicio].fechareinicio),
                style: 'tabla2',
              },
            ],
          );
          contadorReinicio++;
          break;
        case 'Liquidación':
          filasNovedades.push(
            [
              { text: 'FECHA DE LIQUIDACIÓN:', style },
              {
                text: this.formato(this.novedadLiquidacion[0].fechaliquidacion),
                style: 'tabla2',
              },
            ],
          );
          break;
        case 'Terminación':
          filasNovedades.push(
            [
              { text: 'TERMINACIÓN:', style },
              {
                text: this.formato(this.novedadTerminacion[0].fechaterminacionanticipada.slice(0, 10)),
                style: 'tabla2',
              },
            ],
          );
          break;
        case 'Adición':
          contadorModificacion++;
          filasNovedades.push(
            [
              { text: `${textModificacion} ${contadorModificacion}:`, style },
              {
                text:
                  'Se adicionó el valor de $' + this.numeromiles(this.novedadAdicion[contadorAdicion].valoradicion) +
                  '.\n\n' + ' Fecha de la adición: ' +
                  this.formato(this.novedadAdicion[contadorAdicion].fechaadicion.slice(0, 10)),
                style: 'tabla2',
              },
            ],
          );
          contadorAdicion++;
          break;
        case 'Prórroga':
          contadorModificacion++;
          filasNovedades.push(
            [
              { text: `${textModificacion} ${contadorModificacion}:`, style },
              {
                text: 'Prórroga de (' + this.formato(this.novedadProrroga[contadorProrroga].tiempoprorroga) +
                  ') día(s).', style: 'tabla2',
              },
            ],
          );
          contadorProrroga++;
          break;
        case 'Adición/Prórroga':
          contadorModificacion++;
          const fechaFin = new Date(this.novedadAdiPro[contadorAdiPro].fechafinefectiva).toISOString();
          fechaProrroga = new Date(this.novedadAdiPro[contadorAdiPro].fechaadicion);

          const tiempo = this.novedadAdiPro[contadorAdiPro].tiempoprorroga;
          const valoradicion = this.novedadAdiPro[contadorAdiPro].valoradicion;
          const valorTotal = parseInt(valoradicion, 10) + parseInt(this.valorContrato, 10);

          const text = 'Se adicionó valor de ' + this.numerosAletrasService.convertir(parseInt(valoradicion, 10)).toLowerCase() +
            'pesos MCTE. ($' + this.numeromiles(valoradicion) + '). Prórroga de (' + tiempo + ') día(s).\n\n\n' +
            'PRIMERO MODIFICAR EL VALOR el cual quedará así: El Valor del presente contrato es de ' +
            this.numerosAletrasService.convertir(valorTotal).toLowerCase() + 'pesos MCTE. ($' +
            this.numeromiles(valorTotal) + ') — SEGUNDO MODIFICAR EL PLAZO DE EJECUCIÓN: el cual quedará así: PLAZO DE EJECUCIÓN: ' +
            'el plazo del contrato será hasta el ' + this.formato(fechaFin.slice(0, 10)) + ', contados a partir del acta de inicio, ' +
            'previo cumplimiento de los requisitos de perfeccionamiento y ejecución, sin superar el tiempo de la vigencia fiscal.';

          filasProrroga.push(
            [
              { text: `${textModificacion} ${contadorModificacion}:`, style },
              {
                text,
                style: 'tabla2',
              },
            ],
          );
          contadorAdiPro++;
          break;
        case 'Inicio':
          filasNovedades.push(
            [
              { text: 'NOVEDAD INICIO: ', style },
              {
                text: 'Fecha registro: ' + this.formato(this.novedadInicio[contadorInicio].fecharegistro.slice(0, 10)),
                style: 'tabla2',
              },
            ],
          );
          contadorInicio++;
          break;
      }
    }

    if (fechaProrroga > new Date(this.fechaInicio)) {
      filasNovedades.unshift(...filasProrroga);
    }

    return filasNovedades;
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

  consultarFirmantes() {
    const IdCargoJuridica = 78;
    this.AdministrativaAmazon.get('supervisor_contrato?query=CargoId__Id:' + IdCargoJuridica + '&sortby=FechaInicio&order=desc&limit=1')
      .subscribe((response) => {
        if (Object.keys(response[0]).length > 0) {
          this.firmantes = {
            nombre: response[0].Nombre,
            tipoId: 'CC',
            identificacion: String(response[0].Documento),
            cargo: response[0].Cargo,
          };
        } else {
          this.firmantes = undefined;
          this.openWindow('Sin información de Oficina Asesora Jurídica.');
          this.regresarFiltro();
        }
      }, (error) => {
        this.firmantes = undefined;
        this.openWindow('Error al traer información de Oficina Asesora Jurídica.');
        this.regresarFiltro();
      });
  }
  consultarDatosContrato() {
    this.consultarContratista();

    const payloadContrato = 'datosContrato?NumContrato=' + this.dataContrato[0].ContratoSuscrito +
      '&VigenciaContrato=' + this.dataContrato[0].Vigencia;
    this.evaluacionMidService
      .get(payloadContrato)
      .subscribe((res_contrato) => {

        if (res_contrato && res_contrato.Data && res_contrato.Data.length) {
          this.objeto = res_contrato.Data[0].contrato_general.ObjetoContrato;
          this.valorContrato = res_contrato.Data[0].contrato_general.ValorContrato;
          this.tipoContrato = res_contrato.Data[0].contrato_general.TipoContrato.TipoContrato;
          this.actividadEspecifica = res_contrato.Data[0].actividades_contrato.contrato.actividades;
          this.estadoContrato = res_contrato.Data[0].estado_contrato.contratoEstado.estado.nombreEstado;

          const plazo = res_contrato.Data[0].contrato_general.PlazoEjecucion;
          this.valorPorDia = res_contrato.Data[0].contrato_general.ValorContrato / (plazo > 12 ? plazo : plazo * 30);

          if (res_contrato.Data[0].contrato_general.Contratista === this.dataContrato[0].IdProveedor) {
            const payloadActaInicio = 'acta_inicio?query=NumeroContrato:' + res_contrato.Data[0].contrato_general.Id;
            this.AdministrativaAmazon
              .get(payloadActaInicio)
              .subscribe(
                (actaInicio) => {
                  if (actaInicio && actaInicio.length) {
                    this.fechaInicio = new Date(actaInicio[0].FechaInicio).toISOString();
                    this.fechaFin = new Date(actaInicio[0].FechaFin).toISOString();
                    this.consultarNovedades();
                  } else {
                    this.openWindow('No se encontró la información del acta de inicio para el contrato ' +
                      `${this.dataContrato[0].ContratoSuscrito} de ${this.dataContrato[0].Vigencia}. ` +
                      'Contacte Soporte.');
                    this.regresarFiltro();
                  }
                },
                (err) => { },
              );
          } else {
            this.consultarNovedades();
          }
        }

      }),
      (error_service) => {
        this.openWindow(error_service);
        this.regresarFiltro();
      };
  }
  private consultarContratista() {
    const payloadContratista = 'informacion_proveedor?fields=NomProveedor,NumDocumento&query=Id:' + this.dataContrato[0].IdProveedor;
    this.AdministrativaAmazon
      .get(payloadContratista)
      .subscribe(
        (contratista) => {
          if (contratista && contratista.length) {
            this.cedula = contratista[0].NumDocumento;
            this.nombre = contratista[0].NomProveedor;
          }
        },
        (err) => { },
      );
  }
  consultarNovedades() {
    const payloadNovedades = 'novedad/' + this.dataContrato[0].ContratoSuscrito + '/' + this.dataContrato[0].Vigencia;
    this.novedadesService.get(payloadNovedades)
      .subscribe(
        (data: any) => {
          this.allNovedades = data;
          this.datosNovedades.push('Sin novedades');
          for (let i = 0; i < data.length; i++) {
            switch (data[i].tiponovedad) {
              case 1:
                const fechaInicioSuspension = moment(data[i].fechasuspension.slice(0, 10) + 'T12:00:00Z');
                if (this.fechaFin !== '' && fechaInicioSuspension < moment(this.fechaFin.slice(0, 10) + 'T12:00:00Z')) {
                  this.datosNovedades.push('Suspensión');
                  this.novedadSuspension.push(data[i]);
                }
                break;
              case 2:
                const fechaCesion = new Date(data[i].fechacesion);
                if (this.dataContrato[0].IdProveedor === data[i].cedente) { // Cedente termina y puede incluir novedad
                  fechaCesion.setTime(fechaCesion.getTime() - 24 * 60 * 60 * 1000);
                  this.fechaFin = fechaCesion.toISOString();
                  this.datosNovedades.push('Cesión');
                  this.novedadCesion.push(data[i]);
                } else if (this.dataContrato[0].IdProveedor === data[i].cesionario) { // Cesionario inicia acá y no puede incluir novedad
                  this.fechaInicio = fechaCesion.toISOString();
                  if (this.fechaFin === '') {
                    this.fechaFin = new Date(data[i].fechafinefectiva).toISOString();
                  }
                }
                break;
              case 3:
                this.datosNovedades.push('Reinicio');
                this.novedadReinicio.push(data[i]);
                break;
              case 4:
                this.datosNovedades.push('Liquidación');
                this.novedadLiquidacion.push(data[i]);
                break;
              case 5:
                const fechaTerminacion = moment(data[i].fechaterminacionanticipada.slice(0, 10) + 'T12:00:00Z');
                if (this.fechaFin !== '' && fechaTerminacion < moment(this.fechaFin.slice(0, 10) + 'T12:00:00Z')) {
                  this.fechaFin = new Date(data[i].fechaterminacionanticipada).toISOString();
                  this.datosNovedades.push('Terminación');
                  this.novedadTerminacion.push(data[i]);
                }
                break;
              case 6:
                this.datosNovedades.push('Adición');
                this.novedadAdicion.push(data[i]);
                break;
              case 7:
                this.datosNovedades.push('Prórroga');
                this.novedadProrroga.push(data[i]);
                break;
              case 8:
                const fechaInicioAdicion = moment(data[i].fechaadicion.slice(0, 10) + 'T12:00:00Z').subtract(1, 'days');
                const fechaFinContrato = this.fechaFin ? moment(this.fechaFin.slice(0, 10) + 'T12:00:00Z') : '';
                if (fechaFinContrato === '' || fechaFinContrato.format() === fechaInicioAdicion.format()) {
                  if (this.fechaFin !== '') {
                    this.datosNovedades.push('Adición/Prórroga');
                    this.novedadAdiPro.push(data[i]);
                  }
                  this.fechaFin = new Date(data[i].fechafinefectiva).toISOString();
                }
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
