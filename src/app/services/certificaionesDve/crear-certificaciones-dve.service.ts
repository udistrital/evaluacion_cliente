import { Injectable, OnInit } from "@angular/core";
import { PdfMakeWrapper, Table, Txt, Img } from "pdfmake-wrapper";
import { pdfFontTime } from "../../../assets/skins/lightgray/fonts/vfs_fonts_times.js";
import { IMAGENES } from "../../components/images.js";
import { element, text } from "@angular/core/src/render3/instructions.js";
import { image } from "html2canvas/dist/types/css/types/image.js";
import { InformacionCertificacionDve } from "../../@core/data/models/certificacionesDve/informacionCertificacionDve.js";
import { InformacionDVE } from "./../../@core/data/models/certificacionesDve/informacionDVE";
import { IntensidadHorariaDVE } from "../../@core/data/models/certificacionesDve/intensidadHorariaDVE.js";
import swal from "sweetalert2";
import { FirmaElectronicaService } from "../../@core/utils/firma_electronica.service.js";
import { error, table } from "console";
import { AgoraService } from "../agora.service.js";
import { DocumentosCrudService } from "./documentos-crud.service.js";
import { PopUpManager } from "./../../managers/popUpManager";
import { Cell } from "ng2-smart-table";
import { UtilidadesService } from "../../@core/utils/utilidades.service.js";
import { style } from "@angular/animations";

@Injectable({
  providedIn: "root",
})
export class CrearCertificacionesDveService {
  private pdf: PdfMakeWrapper;

  constructor(
    private firmaElectronicaService: FirmaElectronicaService,
    private agoraService: AgoraService,
    private documentosCrudService: DocumentosCrudService,
    private popUpManager: PopUpManager,
    private utilidadesService: UtilidadesService
  ) { }

  /**
   * Tipo de contrato:
   * 1. Hora Cátedra por Honorarios
   * 2. Medio Tiempo Ocasional a Término Fijo
   * 3. Hora Cátedra a Término Fijo
   */

  /**
   * Descripciones de servicios:
   * - Presto sus servicios
   * - Presta sus servicios
   * - Laboro
   * - Labora
   */
  async createPfd(
    informacionCertificacionDve: InformacionDVE,
    icluirSalario: boolean
  ) {

    this.popUpManager.showLoadingAlert(
      "Descargando",
      "Por favor espera un momento"
    );
    this.popUpManager.closeAlert();
    this.pdf = new PdfMakeWrapper();
    this.pdf = this.getStyles();
    this.pdf.pageMargins([40, 100, 40, 0]);
    const fecha = new Date();

    const docDefinition = {
      content: [this.getBody(informacionCertificacionDve)],
      contentTable: [
        this.getTable(informacionCertificacionDve.intensidadHoraria),
      ],
    };
    this.pdf.footer((currentPage, pageCount) =>
      this.getFooter(currentPage, pageCount)
    );
    this.pdf.header((currentPage, pageCount) =>
      this.getHeader(currentPage, pageCount)
    );
    try {
      //  this.pdf.add(docDefinition.Logo);
      this.pdf.add("\n" + "\n");
      this.pdf.add(new Txt(this.getTitles()[0]).style("Title").end);
      this.pdf.add("\n" + "\n");
      this.pdf.add(new Txt(this.getTitles()[1]).style("Title").end);

      this.pdf.add("\n");

      this.pdf.add(docDefinition.content);
      this.pdf.add("\n");
      this.pdf.add(docDefinition.contentTable);
      this.pdf.add("\n");
      icluirSalario == true
        ? this.pdf.add(
          new Txt(
            `\n Salario mensual : ${informacionCertificacionDve.ultimoPagoDve}`
          ).style("textBold").end
        )
        : "";
      this.pdf.add(
        new Txt(
          `Se expide en Bogotá D.C. a los ${fecha.getDate()} días del mes de ${this.obtenerMes(fecha.getMonth())}  del año ${fecha.getFullYear()}  a solicitud del interesado. `
        ).style("text").end
      );

      this.pdf.add("\n" + "\n" + "\n" + "\n");
      // this.pdf.add(new Txt(this.getTitles()[2]).style("Title").end);
      // this.pdf.add(new Txt(this.getTitles()[3]).style("Title").end);
      this.pdf.add("\n");

      //this.pdf.add(this.getTableResponsable());

      this.pdf.add("\n" + "\n");

      this.pdf.create().getBlob(async (blob) => {
        let pdfBase64 = await this.firmarDocumento(
          blob,
          informacionCertificacionDve.nombreDocente
        );

        this.popUpManager.showLoadingAlert("Descargando", "Espera por favor");
        const descarga = document.createElement("a");
        descarga.href = "data:application/pdf;base64," + pdfBase64;
        descarga.download = `${informacionCertificacionDve.nombreDocente}.pdf`;
        descarga.click();
        this.popUpManager.closeAlert();
      });
    } catch (error) { }
  }

  getHeader(currentPage, pageCount) {
    return {
      stack: [
        {
          columns: [
            {
              width: "77%",
              margin: [80, 10],
              stack: [
                {
                  image: IMAGENES.logoUCertificacionesDve,
                  width: 170,
                  margin: [10, 0, 0, 0],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  getFooter(currentPage, pageCount) {
    /* {
          text: `Derecha - Página ${currentPage} de ${pageCount}`,
          alignment: "right",
          fontSize: 6,
       },*/

    return {
      stack: [
        {
          columns: [
            {
              width: "77%",
              margin: [80, 10],
              stack: [
                { text: `PBX 57(1)3239300 Ext. 1603`, fontSize: 8 },
                {
                  text: `Carrera 7 No. 40B- 53 Piso 6, Bogotá D.C. – Colombia`,
                  fontSize: 7,
                },
                {
                  text: [
                    {
                      text: `Acreditación Institucional de Alta Calidad`,
                      fontSize: 7,
                      bold: true,
                    },
                    {
                      text: ` Resolución No. 23096 del 15 de diciembre de 2016`,
                      fontSize: 7,
                    },
                  ],
                },
              ],
            },
            {
              width: "23%",
              margin: [-45, 10, 60, 0],
              stack: [
                {
                  text: `Línea Gratuita de Atención Gratuita`,
                  alignment: "right",
                  fontSize: 7,
                },
                { text: `01 800 091 44 11`, alignment: "right", fontSize: 7 },
                {
                  text: `www.udistrital.edu.co`,
                  alignment: "right",
                  fontSize: 7,
                },
                {
                  text: `talentohumano@udistrital.edu.co`,
                  alignment: "right",
                  fontSize: 7,
                  color: "blue",
                },
              ],
            },
          ],
        },
      ],
    };
  }

  getStyles(): PdfMakeWrapper {
    this.pdf.styles({
      Title: {
        bold: true,
        fontSize: 10,
        alignment: "center",
      },
      text: {
        fontSize: 11,
        alignment: "justify",
      },
      textBold: {
        fontSize: 11,
        bold: true,
        alignment: "justify",
      },
      tableCell: {
        fontSize: 9,
        alignment: "center",
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        alignment: "center",
      },
      tableCellJustify: {
        fontSize: 6,
        alignment: "justify",
        lineHeight: 1.2,
      },
      justify: {
        alignment: "justify",
        lineHeight: 1.2,
      },
      center: {
        alignment: "center",
        lineHeight: 1.2,
      },
    });
    return this.pdf;
  }
  getBody(informacionDVE: InformacionDVE) {

    const content = [
      {
        text: [
          { text: "Que el (la) Señor(a) ", style: "text" },
          { text: `${informacionDVE.nombreDocente} `, style: "textBold" },
          { text: " identificado(a) con cédula de ciudadanía ", style: "text" },
          { text: " número ", style: "text" },
          {
            text: `${informacionDVE.numeroDocumento}, `,
            style: "textBold",
          },
          {
            text: `${informacionDVE.activo === "true" ? "Labora" : "Laboró"
              } en esta Institución en la modalidad de Docente de Vinculación Especial`,
            style: "text",
          },
          {
            text:` ${informacionDVE.dedicacion}`,
            style: "textBold",
          },
          {
            text: `, para los periodos académicos que a continuación se detallan, en el nivel académico`,
            style: "text",
          },
          { text: `${informacionDVE.categoria}`, style: "textBold" },
          { text: " adscrito a la Facultad de: ", style: "text" },
          { text: `${informacionDVE.facultad}`, style: "textBold" },
          { text: " en el Proyecto curricular: ", style: "text" },
          { text: `${informacionDVE.proyectoCurricular}`, style: "textBold" },
          { text: ", con la siguiente intensidad horaria: ", style: "text" },
        ],
      },
    ];

    return content;
  }

  getTable(intensidad: IntensidadHorariaDVE[]) {
    let tables = {
      margin: [0, 5, 0, 10],
      pageBreak: "auto",
      table: {
        dontBreakRows: true,
        style: "tableHeader",
        widths: ["8%", "9%", "13%", "19%", "18%", "9%", "11%", "13%"],
        body: [
          [
            { text: "AÑO", style: "tableHeader" },
            { text: "PERIODO", style: "tableHeader" },
            { text: "RESOLUCION", style: "tableHeader" },
            { text: "PROYECTO", style: "tableHeader" },
            { text: "DEDICACÍON ASIGNATURAS", style: "tableHeader" },
            { text: "HORAS SEMANA", style: "tableHeader" },
            { text: "NUMERO SEMANAS", style: "tableHeader" },
            { text: "TOTAL, HORAS SEMESTRALES", style: "tableHeader" },
          ],
        ],
      },
      layout: {
        vAlign: "middle",
      },
    };

    let dataTable = [];
    intensidad.forEach((element) => {
      const content = this.getContentTable(element);

      content.forEach((row) => {
        tables.table.body.push(row);
      });
    });
    tables.table.body.push();

    return tables;
  }

  getContentTable(intensidad: IntensidadHorariaDVE): any[][] {
    let listaData = [];

    let horasemanasTotales: number = 0;
    let horasemanaSemestrales: number = 0;
    let totalsemanas: number = 0;

    intensidad.resoluciones.forEach((resolucion, index) => {
      horasemanasTotales += resolucion.horasSemanales;
      horasemanaSemestrales += resolucion.horasSemestre;
      totalsemanas += resolucion.numeroSemanas;

      listaData.push([
        {
          text: `${intensidad.anio}`,
          style: "center",
          fontSize: 10,
          rowSpan: intensidad.resoluciones.length,
        },
        {
          text: `${this.utilidadesService.decimalToRoman(intensidad.periodo)}`,
          style: "center",
          fontSize: 10,
          rowSpan: intensidad.resoluciones.length,
        },
        { text: `${resolucion.resolucion}`, style: "tableCell" },
        {
          text: `${resolucion.proyectoCurricular}`,
          style: "center",
          // rowSpan: intensidad.resoluciones.length,
          fontSize: 7,
        },
        {
          text: `${this.agregarSaltoDeLinea(resolucion.asignaturas)}`,
          fontSize: 7,
          style: "center",
        },
        { text: `${resolucion.horasSemanales}`, fontSize: 10, style: "center" },
        {
          text: [
            {
              text: `Del ${this.formatearFecha(
                resolucion.fechaInicio
              )} al ${this.formatearFecha(resolucion.fechaFin)}\n`,
              fontSize: 8,
              style: "center",
            },
            {
              text: `(${resolucion.numeroSemanas} Semanas)\n`,
              fontSize: 7,
              style: "center",
            },
          ],
          alignment: "center",
        },
        { text: `${resolucion.horasSemestre}`, fontSize: 10, style: "center" },
      ]);
    });

    listaData.push([
      {
        text: `${intensidad.anio}-${this.utilidadesService.decimalToRoman(
          intensidad.periodo
        )}`,
        style: "center",
        fontSize: 9,
       // rowSpan: intensidad.resoluciones.length,
      },
      {
        text: `Totales`,
        style: "center",
        fontSize: 9,
      //  rowSpan: intensidad.resoluciones.length,
      },
      { text: ``, style: "tableCell" },
      { text: ``, fontSize: 7, style: "center" },
      { text: `${intensidad.tipoVinculacion}`, fontSize: 7, style: "center" },
      { text: `${horasemanasTotales}`, fontSize: 9, style: "center" },
      {
        text: `${totalsemanas}`,
        fontSize: 9,
        style: "center",

        alignment: "center",
      },
      { text: `${horasemanaSemestrales}`, fontSize: 9, style: "center" },
    ]);
    horasemanasTotales = 0;
    horasemanaSemestrales = 0;
    totalsemanas = 0;
    return listaData;
  }

  getTableResponsable() {
    const table = {
      table: {
        style: "",
        widths: ["25%", "25%", "25%", "25%"],
        body: [
          [
            { text: "", style: "tableHeader" },
            { text: "NOMBRE", style: "tableHeader" },
            { text: "CARGO", style: "tableHeader" },
            { text: "FIRMA", style: "tableHeader" },
          ],
          [
            { text: "Proyectó", style: "tableCell" },
            { text: "", style: "tableCell" },
            { text: "", style: "tableCell" },
            { text: "", style: "tableCell" },
          ],
        ],
      },
    };
    return table;
  }

  getFuentePdf() {
    PdfMakeWrapper.setFonts(pdfFontTime, {
      TimesNewRoman: {
        normal: "Times-Regular.ttf",
        bold: "Times-Bold.ttf",
        italics: "Times-Italic.ttf",
        bolditalics: "Times-BoldItalic.ttf",
      },
    });
    PdfMakeWrapper.useFont("TimesNewRoman");
  }

  getTitles() {
    return [
      "LA JEFE DE LA OFICINA DE TALENTO HUMANO DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS NIT 899.999.230-7 ",
      "CERTIFICA",
      "ANDREA CAROLINA HOSPITAL GORDILLO",
      "Jefe de la Oficina de Talento Humano",
    ];
  }

  async firmarDocumento(file: any, nombreArchivo: string): Promise<string> {
    let data = await this.obtenerDatosSuperVisor();
    this.popUpManager.showLoadingAlert("Firmando", "Espera... por favor");
    let idDocumnento = await this.consultarTipoDeDocumento();
    let docsAFirmar = [
      {
        IdDocumento: 12,
        nombre: nombreArchivo + ".pdf",
        metadatos: {},
        descripcion: "",
        file: file,
        firmantes: [
          {
            nombre: data.Nombre,
            cargo: data.Cargo,
            tipoId: "CC",
            identificacion: String(data.Documento),
          },
        ],
        representantes: [],
      },
    ];

    try {
      return new Promise((resolve, reject) => {
        this.firmaElectronicaService
          .uploadFilesElectronicSign(docsAFirmar)
          .subscribe({
            next: (response: any) => {
              if (response && response.length > 0) {
                this.popUpManager.closeAlert();
                resolve(response[0].file);
              } else {
                reject("No se recibió una respuesta válida.");
              }
            },
            error: (error) => {
              this.popUpManager.showErrorAlert(
                "Error al firmar el documento. Intenta de nuevo."
              );
              reject(error);
            },
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async obtenerDatosSuperVisor(): Promise<any> {
    this.consultarTipoDeDocumento();
    try {
      return new Promise((resolve, reject) => {
        this.agoraService
          .get(
            "supervisor_contrato?query=DependenciaSupervisor:DEP633&sortby=FechaInicio&order=desc"
          )
          .subscribe({
            next: (response: any) => {
              if (response && response.length > 0) {
                resolve(response[0]);
              } else {
                reject("No se obtuvieron los datos requeridos");
              }
            },
          });
      });
    } catch (error) { }
  }
  async consultarTipoDeDocumento(): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        this.documentosCrudService
          .get("tipo_documento/?query=CodigoAbreviacion:CERT-DVE&limit=0")
          .subscribe({
            next: (response) => {
              if (response && response.length > 0) {
                resolve(response[0].Id);
              } else {
                resolve(12);
              }
            },
            error: (error) => {
              console.log(error);
            },
          });
      });
    } catch (error) { }
  }


  obtenerMes(index: number): string {
    const meses: string[] = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];
    return meses[index];
  }
  formatearFecha(fecha: Date): string {
    
    const date = new Date(fecha);

    const dia = date.getDate();
    const mes = this.obtenerMes(date.getMonth());
    const anio = date.getFullYear();

    return `${dia} de ${mes} de ${anio}`;
  }

  agregarSaltoDeLinea(names: string): string {
    return names.replace(/,/g, "\n\n");
  }
}
