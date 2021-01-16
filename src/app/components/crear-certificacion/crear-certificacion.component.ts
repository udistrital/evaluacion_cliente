import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  ElementRef,
} from "@angular/core";
import { NuxeoService } from "../../@core/utils/nuxeo.service";
import { DocumentoService } from "../../@core/data/documento.service";
import { PdfMakeWrapper } from "pdfmake-wrapper";
import { Txt } from "pdfmake-wrapper";
import { EvaluacionmidService } from "../../@core/data/evaluacionmid.service";
import { NbWindowService } from "@nebular/theme";

// Set the fonts to use

@Component({
  selector: "ngx-crear-certificacion",
  templateUrl: "./crear-certificacion.component.html",
  styleUrls: ["./crear-certificacion.component.scss"],
})
export class CrearCertificacionComponent implements OnInit {
  @ViewChild("contentTemplate", { read: false })
  contentTemplate: TemplateRef<any>;
  @Output() volverFiltro: EventEmitter<Boolean>;
  @Input() dataContrato: any = [];
  uidDocumento: string;
  idDocumento: number;
  novedad: string;
  objeto: string;
  actividadEspecifica: string;
  valorContrato: string;

  constructor(
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private windowService: NbWindowService
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
    var valorNovedad = "";
    if (this.novedad === "sin novedad") {
      valorNovedad = "";
    } else if (this.novedad === "terminacion y liquidacion") {
      valorNovedad = "ACTA DE TERMINACIÓN Y LIQUIDACIÓN BILATERAL ";
    } else if (this.novedad === "suspension") {
      valorNovedad = "ACTA DE SUSPENSIÓN DE";
    }

    var cadena1 =
      "QUE, REVISADA LA BASE DE DATOS DE CONTRATACIÓN, SE ENCONTRÓ QUE ";
    var cadena2 = " IDENTIFICADO(A) CON CÉDULA DE CIUDADANÍA NO. ";
    var cadena3 =
      " , SUSCRIBIÓ CON LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS LOS SIGUIENTES CONTRATOS:  ";
    var date = new Date();

    this.actividadEspecifica =
      " 1.  COLABORAR EN LA ELABORACIÓN DE (HORARIOS, INSCRIPCIONES, ADICIONES, CANCELACIONES, CARGA ACADÉMICA REGISTROS Y TRANSFERENCIAS). 2. CONTRIBUIR CON EL APOYO A LA GENERACIÓN DEL, PLAN DE ACCIÓN, PLANES DE TRABAJO, INFORMES DE GESTIÓN,  3. Y DEMÁS FUNCIONES CONEXAS Y COMPLEMENTARIAS  A LA NATURALEZA DEL OBJETO DEL CONTRATO.";

    const pdf = new PdfMakeWrapper();
    pdf.pageMargins([50, 60, 40, 30]);
    pdf.styles({
      Title: {
        bold: true,
        fontSize: 14,
        alignment: "center",
      },
      body: {
        fontSize: 11,
        alignment: "justify",
      },
      body1: {
        fontSize: 11,
        bold: true,
        alignment: "justify",
      },
    });

    var docDefinition = {
      content: [
        {
          text: [
            { text: cadena1, style: "body" },
            { text: this.dataContrato[0].NombreProveedor, style: "body1" },
            { text: cadena2, style: "body" },
            { text: "1014250554", style: "body1", bold: true },
            { text: cadena3, style: "body" },
            { text: "", style: "body" },
          ],
        },
      ],
      line: [
        {
          text:
            "____________________________________________________________________________________________________",
          style: "body",
        },
      ],
      content2: [
        {
          text: [
            { text: "OBJETO: ", style: "body1", bold: true },
            { text: this.objeto, style: "body" },
          ],
        },
      ],
      content3: [
        {
          text: [
            { text: "ACTIVIDAD ESPECÍFICA: ", style: "body1", bold: true },
            { text: this.actividadEspecifica, style: "body" },
          ],
        },
      ],
      valorContra: [
        {
          text: [
            { text: "VAlOR: $ ", style: "body1", bold: true },
            { text: this.valorContrato, style: "body" },
          ],
        },
      ],
      styles: {
        Title: {
          bold: true,
          fontSize: 14,
          alignment: "center",
        },
        body: {
          fontSize: 11,
          alignment: "justify",
        },
        body1: {
          fontSize: 11,
          bold: true,
          alignment: "justify",
        },
      },
    };

    //-------------------------------------------------------------------------------------

    pdf.header(
      new Txt("EL SUSCRITO JEFE DE LA OFICINA ASESORA JURIDICA").style("Title")
        .end
    );
    pdf.add(new Txt("CERTIFICA").style("Title").end);

    pdf.add("\n");
    //------------------------------ se arma el primer parrafo
    pdf.add(docDefinition.content[0]);
    pdf.add(docDefinition.line);

    pdf.add("\n");

    pdf.add(
      new Txt(
        "CONTRATO DE PRESTACIÓN DE SERVICIOS NO." +
          this.dataContrato[0].ContratoSuscrito +
          "-" +
          this.dataContrato[0].Vigencia
      ).bold().end
    );
    pdf.add("\n\n");
    pdf.add(
      new Txt(
        "FECHA DE SUSCRIPCIÓN: " +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear()
      ).bold().end
    );
    pdf.add("\n\n");
    pdf.add(docDefinition.content2);
    pdf.add("\n\n");
    pdf.add(docDefinition.content3);
    pdf.add("\n\n");
    pdf.add(docDefinition.valorContra);

    pdf.footer(
      new Txt(
        "Carrera 7 No. 40 B – 53 Piso 9° PBX: 3239300 Ext: 1911 – 1919 – 1912 Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016"
      )
        .alignment("center")
        .bold().end
    );

    //this.postSoporteNuxeo([{Id:5, nombre:"frederick"}]);
    let arreglo =[]
    pdf.create().getBlob((blob) => {
      const file={
        IdDocumento:16,
        file:blob,
        nombre: 1014250554,

      }
      arreglo.push(file);
      
    });
    this.uploadFilesToMetadaData(arreglo,[]);

    
  }

  uploadFilesToMetadaData(files, respuestas) {
    return new Promise((resolve, reject) => {
      files.forEach((file) => {
        file.Id = file.nombre,
          file.nombre = 'soporte_' + file.Id + '_prod_' + 1014250554;
        file.key = file.Id;
      });
      this.nuxeoService.getDocumentos$(files, this.documentoService)
        .subscribe(response => {
          console.info('uploadFilesToMetadata - Resp nuxeo: ', response);
          if (Object.keys(response).length === files.length) {
            // files.forEach((file) => {
            //   respuestas.push({
            //     fecha_presentacion: (new Date()).toISOString(),
            //     respuestas: [
            //       {
            //         item_id: file.Id,
            //         respuesta: response[file.Id].Id,
            //       },
            //     ],
            //   });
            // });
            resolve(true);
          }
        }, error => {
          reject(error);
        });
    });
  }
  consultarDatosContrato() {
    this.evaluacionMidService
      .get(
        "datosContrato/?NumContrato=" +
          this.dataContrato[0].ContratoSuscrito +
          "&VigenciaContrato=" +
          this.dataContrato[0].Vigencia
      )
      .subscribe((res_contrato) => {
        console.log("aca esta el contrato", res_contrato);
        this.objeto = res_contrato[0].contrato_general.ObjetoContrato;
        this.valorContrato = res_contrato[0].contrato_general.ValorContrato;
      }),
      (error_service) => {
        this.openWindow(error_service.message);
        this.regresarFiltro();
      };
  }
  openWindow(mensaje) {
    this.windowService.open(this.contentTemplate, {
      title: "Alerta",
      context: { text: mensaje },
    });
  }

  
}
