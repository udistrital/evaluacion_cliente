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
import { PdfMakeWrapper, Img, Columns, Table, Cell } from "pdfmake-wrapper";
import { Txt } from "pdfmake-wrapper";
import { EvaluacionmidService } from "../../@core/data/evaluacionmid.service";
import { NbWindowService } from "@nebular/theme";
import pdfFonts from "../../../assets/skins/lightgray/fonts/custom-fonts";
import { AdministrativaamazonService } from "../../@core/data/admistrativaamazon.service";

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
  cedula: string;
  numeroContrato: string;
  actividadEspecifica: string;
  valorContrato: string;
  nombre: string;
  //los valores que tienes un _ ejemplo valor_contrato son para validar si el usuario quiere ese dato en el pdf
  valor_contrato: string;
  duracion_contrato: string;
  fecha_Inicio: string;
  fecha_final: string;
  nuevo_texto: boolean = false;
  //----------------------------------------------------------------------------------
  tituloNovedad: string = "";
  textoNovedad: string = "";
  fechaSuscrip: string = "";
  duracionContrato: string = "";
  idContrato: string = "";
  fechaInicio: string = "";
  fechaFin: string = " ";

  constructor(
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private windowService: NbWindowService,
    private AdministrativaAmazon: AdministrativaamazonService
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
      "QUE, REVISADA LA BASE DE DATOS DE CONTRATACIÓN, SE ENCONTRÓ QUE ";
    var cadena2 = " IDENTIFICADO(A) CON CÉDULA DE CIUDADANÍA NO. ";
    var cadena3 =
      " , SUSCRIBIÓ CON LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS LOS SIGUIENTES CONTRATOS:  ";
    var date = new Date();

    this.actividadEspecifica =
      " 1.  COLABORAR EN LA ELABORACIÓN DE (HORARIOS, INSCRIPCIONES, ADICIONES, CANCELACIONES, CARGA ACADÉMICA REGISTROS Y TRANSFERENCIAS). 2. CONTRIBUIR CON EL APOYO A LA GENERACIÓN DEL, PLAN DE ACCIÓN, PLANES DE TRABAJO, INFORMES DE GESTIÓN,  3. Y DEMÁS FUNCIONES CONEXAS Y COMPLEMENTARIAS  A LA NATURALEZA DEL OBJETO DEL CONTRATO.";

    PdfMakeWrapper.setFonts(pdfFonts, {
      myCustom: {
        normal: "calibri-light-2.ttf",
        bold: "calibri-bold-2.ttf",
        italics: "calibri-light-2.ttf",
        bolditalics: "calibri-light-2.ttf",
      },
    });
    PdfMakeWrapper.useFont("myCustom");

    const pdf = new PdfMakeWrapper();

    pdf.pageMargins([80, 10, 60, 30]);
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
      body2: {
        fontSize: 8,
        bold: false,
        alignment: "justify",
      },
    });

    var docDefinition = {
      content: [
        {
          text: [
            { text: cadena1, style: "body" },
            { text: this.nombre, style: "body1" }, //nombre
            { text: cadena2, style: "body" },
            { text: this.cedula, style: "body1", bold: true }, //cedula
            { text: cadena3, style: "body" },
            { text: "", style: "body" },
          ],
        },
      ],
      line: [
        {
          text:
            "___________________________________________________________________________________",
          style: "body",
        },
      ],
      content2: [
        {
          text: [
            { text: "OBJETO: ", style: "body1", bold: true },
            { text: this.objeto, style: "body" }, //objeto del contrato
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
            { text: "VALOR: $ ", style: "body1", bold: true },
            { text: this.valorContrato, style: "body" },
          ],
        },
      ],
      valorCabe: [
        {
          text: [
            {
              text:
                "\n \n UNIVERSIDAD DISTRITAL \n  FRANCISCO JOSÉ DE CALDAS \n  Oficina Asesora Jurídica ",
              style: "body1",
              bold: true,
            },
          ],
        },
      ],
      duraContra: [
        {
          text: [
            { text: "DURACION:  ", style: "body1", bold: true },
            { text: this.duracionContrato + " meses", style: "body" },
          ],
        },
      ],
      fechainicio: [
        {
          text: [
            { text: "FECHA DE INICIO:  ", style: "body1", bold: true },
            { text: this.fechaInicio.slice(0, 10), style: "body" },
          ],
        },
      ],
      fechafin: [
        {
          text: [
            { text: "FECHA DE FINALIZACION:  ", style: "body1", bold: true },
            { text: this.fechaFin.slice(0, 10), style: "body" },
          ],
        },
      ],
      fechaSub: [
        {
          text: [
            { text: "FECHA DE SUSCRIPCIÓN:  ", style: "body1", bold: true },
            { text: this.fechaSuscrip.slice(0, 10), style: "body" },
          ],
        },
      ],
      texTituloNovedad: [
        {
          text: [
            {
              text: this.tituloNovedad.toUpperCase() + ": ",
              style: "body1",
              bold: true,
            },
            { text: this.textoNovedad.toUpperCase(), style: "body" },
          ],
        },
      ],
      texPieDePagina: [
        {
          text: [
            {
              text:
                "Carrera 7 No. 40 B – 53 Piso 9° PBX: 3239300 Ext: 1911 – 1919 – 1912 Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016",
              style: "body2",
              bold: true,
            },
          ],
        },
      ],
      firmaPagina: [
        {
          text: [
            {
              text:
                "FERNANDO ANTONIO TORRES GÓMEZ  \n JEFE OFICINA ASESORA JURÍDICA",
              style: "body1",
              bold: true,
              alignment: "center",
            },
          ],
        },
      ],
      firmaImagen: [
        {
          image: "data:image/jpeg;base64,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",
          alignment: "center",
          width: 200,

        },
      ],

      
    };
    

    //-------------------------------------------------------------------------------------
    
    
    new Img(
      "https://pbs.twimg.com/profile_images/1108821606388895744/RKGG9dsZ.png"
    )
      .fit([80, 80])
      .build()

      .then((img) => {
        

        pdf.add(
          new Table([[img, docDefinition.valorCabe]]).layout("noBorders").end
        );
        pdf.add("\n");
        pdf.add("\n");
        pdf.add("\n");

        pdf.add(
          new Txt("EL SUSCRITO JEFE DE LA OFICINA ASESORA JURIDICA").style(
            "Title"
          ).end
        );
        pdf.add("\n");
        pdf.add("\n");
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
        if (this.fecha_Inicio == "1") {
          pdf.add("\n\n");
          pdf.add(docDefinition.fechainicio);
        }
        if (this.fecha_final == "1") {
          pdf.add("\n\n");
          pdf.add(docDefinition.fechafin);
        }
        pdf.add("\n\n");
        pdf.add(docDefinition.fechaSub);
        pdf.add("\n\n");
        pdf.add(docDefinition.content2);
        pdf.add("\n\n");
        pdf.add(docDefinition.content3);
        pdf.add("\n\n");

        if (this.duracion_contrato == "1") {
          pdf.add(docDefinition.duraContra);
        }
        if (this.valor_contrato == "1") {
          pdf.add(docDefinition.valorContra);
        }

        if (this.nuevo_texto == true) {
          pdf.add("\n\n");
          pdf.add(docDefinition.texTituloNovedad);
        }
        pdf.add(docDefinition.firmaImagen);
        pdf.add(docDefinition.firmaPagina);
        
       

        pdf.footer(
          new Txt(
            "Carrera 7 No. 40 B – 53 Piso 9° PBX: 3239300 Ext: 1911 – 1919 – 1912 Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016"
          )
            .alignment("center")
            .bold().end
        );
        pdf
          .create()
          .download(
            "Certificacion_" + this.numeroContrato + "__" + this.cedula
          );

        let arreglo = [];
        pdf.create().getBlob((blob) => {
          const file = {
            IdDocumento: 16,
            file: blob,
            nombre: "",
          };
          arreglo.push(file);

          //this.uploadFilesToMetadaData(arreglo, []);
        });
      });

    // pdf.header();

    //-------------------------------------------------------------------------------------
  }

  uploadFilesToMetadaData(files, respuestas) {
    console.log("subiendo archivos");
    return new Promise((resolve, reject) => {
      files.forEach((file) => {
        (file.Id = file.nombre),
          (file.nombre =
            "certificacion_" +
            file.Id +
            this.numeroContrato +
            "__" +
            this.cedula);
        file.key = file.Id;
      });
      this.nuxeoService.getDocumentos$(files, this.documentoService).subscribe(
        (response) => {
          //this.documentoService.post("documentos",'prueba');
          console.log(response);
          console.info("uploadFilesToMetadata - Resp nuxeo: ", response);
          if (Object.keys(response).length === files.length) {
            resolve(true);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  consultarDatosContrato() {
    this.evaluacionMidService
      .get(
        "datosContrato?NumContrato=" +
          this.dataContrato[0].ContratoSuscrito +
          "&VigenciaContrato=" +
          this.dataContrato[0].Vigencia
      )
      .subscribe((res_contrato) => {
        //console.log("aca esta el contrato", res_contrato);
        this.objeto = res_contrato[0].contrato_general.ObjetoContrato;
        this.valorContrato = res_contrato[0].contrato_general.ValorContrato;
        this.cedula = res_contrato[0].informacion_proveedor.NumDocumento;
        this.nombre = res_contrato[0].informacion_proveedor.NomProveedor;
        this.numeroContrato =
          res_contrato[0].contrato_general.ContratoSuscrito[0].NumeroContratoSuscrito;
        this.fechaSuscrip =
          res_contrato[0].contrato_general.ContratoSuscrito[0].FechaSuscripcion;
        this.duracionContrato = res_contrato[0].contrato_general.PlazoEjecucion;
        this.idContrato =
          res_contrato[0].contrato_general.ContratoSuscrito[0].NumeroContrato.Id;
        //console.log(this.idContrato);

        this.AdministrativaAmazon.get(
          "acta_inicio?query=NumeroContrato:" + this.idContrato
        ).subscribe((res_Contrato) => {
          this.fechaInicio = res_Contrato[0].FechaInicio;
          this.fechaFin = res_Contrato[0].FechaFin;
        });
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
