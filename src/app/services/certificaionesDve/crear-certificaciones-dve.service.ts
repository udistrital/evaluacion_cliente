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
import { error } from "console";

@Injectable({
  providedIn: "root",
})
export class CrearCertificacionesDveService {
  private pdf: PdfMakeWrapper;

  constructor(private firmaElectronicaService: FirmaElectronicaService) {}

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
    informacionCertificacionDve: InformacionCertificacionDve,
    icluirSalario: boolean
  ) {
    this.pdf = new PdfMakeWrapper();
    this.pdf = this.getStyles();
    this.pdf.pageMargins([80, 100, 60, 60]);
    const ultimoPago =
      informacionCertificacionDve.intensidadHorariaDVE.length - 1;
    const fecha = new Date();

    const docDefinition = {
      content: [this.getBody(informacionCertificacionDve.informacionDve)],
      contentTable: [
        this.getTable(informacionCertificacionDve.intensidadHorariaDVE),
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
              `Salario mensual : ${informacionCertificacionDve.intensidadHorariaDVE[ultimoPago].salarioDocente}`
            ).style("textBold").end
          )
        : "";
      this.pdf.add(
        new Txt(
          `Se expide en Bogotá D.C. a los ${fecha.getDate()} días del mes de ${fecha.getMonth()}  del año ${fecha.getFullYear()}  a solicitud del interesado. `
        ).style("text").end
      );

      this.pdf.add("\n" + "\n" + "\n" + "\n");
      this.pdf.add(new Txt(this.getTitles()[2]).style("Title").end);
      this.pdf.add(new Txt(this.getTitles()[3]).style("Title").end);
      this.pdf.add("\n");

      //this.pdf.add(this.getTableResponsable());

      this.pdf.add("\n" + "\n");
      this.pdf.create().getBlob(async (blob) => {
        let pdfBase64 = await this.firmarDocumento(
          blob,
          informacionCertificacionDve.informacionDve.nombre_docente
        );
        const descarga = document.createElement("a");
        descarga.href = "data:application/pdf;base64," + pdfBase64;
        descarga.download = `${informacionCertificacionDve.informacionDve.nombre_docente}.pdf`;
        descarga.click();
      });
    } catch (error) {
      console.error(error);
    }
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
    });
    return this.pdf;
  }
  getBody(informacionDVE: InformacionDVE) {
    const content = [
      {
        text: [
          { text: "Que el (la) Señor(a) ", style: "text" },
          { text: `${informacionDVE.nombre_docente} `, style: "textBold" },
          { text: " identificado(a) con cédula de ciudadania ", style: "text" },
          { text: " número ", style: "text" },
          {
            text: `${informacionDVE.numero_documento}` + ", ",
            style: "textBold",
          },
          {
            text: ` ${
              informacionDVE.activo == "true" ? "Labora" : "Laboro "
            }en  esta Institución en la modalidad de Docente de Vinculación Especial {tipoModalidad}, para los periodos académicos que a continuación se detallan, en el nivel académico  `,
            style: "text",
          },
          { text: `${informacionDVE.nivel_academico}`, style: "textBold" },
          { text: "  adscrito a la Facultad de : ", style: "text" },
          { text: `${informacionDVE.facultad}`, style: "textBold" },
          { text: "  en el Proyecto curricular: ", style: "text" },
          { text: `${informacionDVE.proyecto_curricular}`, style: "textBold" },
          { text: ", con la siguiente intensidad horaria: ", style: "text" },
        ],
      },
    ];

    return content;
  }

  getTable(intensidad: IntensidadHorariaDVE[]) {
    const table = {
      table: {
        style: "tableHeader",
        widths: ["auto", "*", "*", "auto", "auto", "auto"],
        body: [
          [
            { text: "AÑO", style: "tableHeader" },
            { text: "PERIODO", style: "tableHeader" },
            { text: "DEDICACIÓN ASIGNATURAS", style: "tableHeader" },
            { text: "HORAS SEMANA", style: "tableHeader" },
            { text: "NUMERO SEMANAS", style: "tableHeader" },
            { text: "TOTAL HORAS SEMESTRALES", style: "tableHeader" },
          ],
        ],
      },
    };
    this.getContentTable(intensidad).forEach((element) => {
      table.table.body.push(element);
    });
    return table;
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

  getContentTable(intensidad: IntensidadHorariaDVE[]): any[][] {
    let listaTem = [];

    for (let i = 0; i < intensidad.length; i++) {
      if ((1 + i) % 2 != 0) {
        listaTem.push([
          { text: `${intensidad[i].anio}`, style: "tableCell" },
          { text: `${intensidad[i].periodo}`, style: "tableCell" },
          { text: "", style: "tableCell" },
          { text: "", style: "tableCell" },
          {
            text:
              "DEL 8 DE FEBRERO AL 15 DE JUNIO DE 2001" +
              "\n" +
              "DEL 8 DE FEBRERO AL 15 DE JUNIO DE 2001",
            style: "tableCell",
          },
          { text: "", style: "tableCell" },
        ]);
      } else {
        listaTem.push([
          {
            text: `${intensidad[i].anio}-${intensidad[i].periodo}`,
            style: "tableCell",
          },
          { text: "Totales", style: "tableCell" },
          { text: "Hora Catedra", style: "tableCell" },
          { text: "", style: "tableCell" },
          { text: `${intensidad[i].horasSemana}`, style: "tableCell" },
          { text: `${intensidad[i].horasSemestrales}`, style: "tableCell" },
        ]);
      }
    }

    return listaTem;
  }

  getContentTableest(): any[][] {
    return [
      [
        { text: "2024", style: "tableCell" },
        { text: "I", style: "tableCell" },
        { text: "", style: "tableCell" },
        { text: "", style: "tableCell" },
        {
          text:
            "DEL 8 DE FEBRERO AL 15 DE JUNIO DE 2001" +
            "\n" +
            "DEL 8 DE FEBRERO AL 15 DE JUNIO DE 2001",
          style: "tableCell",
        },
        { text: "", style: "tableCell" },
      ],
      [
        { text: "2024-1", style: "tableCell" },
        { text: "Totales", style: "tableCell" },
        { text: "Hora Catedra", style: "tableCell" },
        { text: "", style: "tableCell" },
        { text: "18", style: "tableCell" },
        { text: "0", style: "tableCell" },
      ],
    ];
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
    let docsAFirmar = [
      {
        IdDocumento: 12,
        nombre: nombreArchivo + ".pdf",
        metadatos: {},
        descripcion: "",
        file: file,
        firmantes: [
          {
            nombre: "solicituDeFirma.NombreResponsable,",
            cargo: "Supervisor",
            tipoId: "CC",
            identificacion: "88194457",
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
              if ( response &&response.length > 0) {
                resolve(response[0].file);
              } else {
                reject("No se recibió una respuesta válida.");
              }
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
