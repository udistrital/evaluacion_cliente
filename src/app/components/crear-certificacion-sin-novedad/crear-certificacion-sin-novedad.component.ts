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
import { EvaluacioncrudService } from '../../@core/data/evaluacioncrud.service';

// Set the fonts to use

@Component({
  selector: "ngx-crear-certificacion-sin-novedad",
  templateUrl: "./crear-certificacion-sin-novedad.component.html",
  styleUrls: ["./crear-certificacion-sin-novedad.component.scss"],
})
export class CrearCertificacionSinNovedadComponent implements OnInit {
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
  valor_Contrato: string;
  duracion_Contrato: string;
  fecha_Inicio: string;
  fecha_final: string;
  fecha_suscrip: string;
  duracion_contrato: string;
  evaluacionRealizada: any;
  fechaEvaluacion: Date;
 
  
  constructor(
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private windowService: NbWindowService,
    private evaluacionCrudService: EvaluacioncrudService,
  ) {
    this.volverFiltro = new EventEmitter();
    this.evaluacionRealizada = {};
    this.fechaEvaluacion = new Date();
  }

  ngOnInit() {
    this.evaluacionCrudService.get('evaluacion?query=ContratoSuscrito:' + this.dataContrato[0].ContratoSuscrito +
      ',Vigencia:' + this.dataContrato[0].Vigencia).subscribe((res_evaluacion) => {
        if (Object.keys(res_evaluacion[0]).length !== 0) {
          this.evaluacionCrudService.getEvaluacion('resultado_evaluacion?query=IdEvaluacion:' + res_evaluacion[0].Id + ',Activo:true');
          this.evaluacionCrudService.get('resultado_evaluacion?query=IdEvaluacion:' + res_evaluacion[0].Id + ',Activo:true')
            .subscribe((res_resultado_eva) => {
              if (res_resultado_eva !== null) {
                this.evaluacionRealizada = JSON.parse(res_resultado_eva[0].ResultadoEvaluacion);
                this.fechaEvaluacion = new Date(res_resultado_eva[0].FechaCreacion.substr(0, 16));
                
              }
            }, (error_service) => {
              this.openWindow(error_service.message);
            });
        } else {
          this.regresarFiltro();
          this.openWindow('El contrato no ha sido evaluado.');
        }
      }, (error_service) => {
        this.openWindow(error_service.message);
      });
    //console.log("Modulo de certificaciones sin novedades");
    this.consultarDatosContrato();
  }
  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  crearPdf() {
    var cadena1 = "QUE EL SEÑOR(A) ";
    var cadena2 = " IDENTIFICADO(A) CON CÉDULA DE CIUDADANÍA NO. ";
    var cadena3 = " , CUMPLIO A SATISFACCIÓN CON LAS SIGUIENTES ORDENES ";
    

    PdfMakeWrapper.setFonts(pdfFonts, {
      myCustom: {
        normal: "Calibrilight.ttf",
        bold:
          "https://db.onlinewebfonts.com/t/8415cddd12851fb7439d5fa5c23ea4d5.ttf",
        italics: "Calibrilight.ttf",
        bolditalics: "Calibrilight.ttf",
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
            { text: "6 meses", style: "body" },
          ],
        },
      ],
      fechainicio: [
        {
          text: [
            { text: "FECHA DE INICIO:  ", style: "body1", bold: true },
            { text: "24/09/2020", style: "body" },
          ],
        },
      ],
      fechafin: [
        {
          text: [
            { text: "FECHA DE FINALIZACION:  ", style: "body1", bold: true },
            { text: "23/03/2021", style: "body" },
          ],
        },
      ],
      fechaSub: [
        {
          text: [
            { text: "FECHA DE SUSCRIPCIÓN:  ", style: "body1", bold: true },
            { text: this.fecha_suscrip, style: "body" },
          ],
        },
      ],
      resultadoEva: [
        {
          text: [
            { text: "CUMPLIMIENTO:  ", style: "body1", bold: true },
            { text: this.getCalificacion(), style: "body" },
          ],
        },
        
      ],
      footer: [
        {
          text: [
            { text: "PBX: 3239300 Ext: 1911 – 1919 – 1912 \n Carrera 7 No. 40 B – 53 Piso 9°  Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016 ", style: "body1", bold: true },
            { text: this.fecha_suscrip, style: "body" },
          ],
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
          new Txt("EL SUSCRITO JEFE DE LA SECCIÓN DE COMPRAS DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS").style(
            "Title"
          ).end
        );
        pdf.add(
          new Txt("NIT: 899.999.230-7").style(
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
        pdf.add("\n\n");
        //-------------------------------- Objeto
        pdf.add(docDefinition.content2);
        pdf.add("\n\n");
        //-------------------------------- fehca de suscripcion
        pdf.add(docDefinition.fechaSub);

        pdf.add("\n");

        
        if (this.valor_Contrato == "1") {
          pdf.add(docDefinition.valorContra);
        }
        pdf.add("\n\n");

        if (this.duracion_Contrato == "1") {
          pdf.add(docDefinition.duraContra);
        }
        pdf.add("\n\n");
        if (this.fecha_Inicio == "1") {
          pdf.add(docDefinition.fechainicio);
        }
        pdf.add("\n\n");
        if (this.fecha_final == "1") {
          pdf.add(docDefinition.fechafin);
        }
        pdf.add("\n\n");
        pdf.add(docDefinition.resultadoEva)
        pdf.add("\n\n");

        pdf.add("\n\n");

        pdf.add("\n\n");

        pdf.footer(
          new Txt(
            "Carrera 7 No. 40 B – 53 Piso 9° PBX: 3239300 Ext: 1911 – 1919 – 1912 Bogotá D.C. – Colombia \n Acreditación Institucional de Alta Calidad. Resolución No. 23096 del 15 de diciembre de 2016"
          )
            .alignment("center")
            .bold().end
        );
      });

    // pdf.header();
    pdf
      .create()
      .download("Certificacion_" + this.numeroContrato + "__" + this.cedula);

    //-------------------------------------------------------------------------------------

    //this.postSoporteNuxeo([{Id:5, nombre:"frederick"}]);
    let arreglo = [];
    pdf.create().getBlob((blob) => {
      const file = {
        IdDocumento: 16,
        file: blob,
        nombre: 1014250554,
      };
      arreglo.push(file);
      //subida de archivo a nuxeo
      //this.uploadFilesToMetadaData(arreglo, []);
    });
  }

  uploadFilesToMetadaData(files, respuestas) {
    console.log("subiendo archivos");
    return new Promise((resolve, reject) => {
      files.forEach((file) => {
        (file.Id = file.nombre),
          (file.nombre = "soporte_" + file.Id + "_prod_" + 1014250554);
        file.key = file.Id;
      });
      this.nuxeoService.getDocumentos$(files, this.documentoService).subscribe(
        (response) => {
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
        console.log("aca esta el contrato", res_contrato);
        this.objeto = res_contrato[0].contrato_general.ObjetoContrato;
        this.valorContrato = res_contrato[0].contrato_general.ValorContrato;
        this.cedula = res_contrato[0].informacion_proveedor.NumDocumento;
        this.nombre = res_contrato[0].informacion_proveedor.NomProveedor;
        this.numeroContrato =
          res_contrato[0].contrato_general.ContratoSuscrito[0].NumeroContratoSuscrito;
        this.fecha_suscrip =
          res_contrato[0].contrato_general.ContratoSuscrito[0].FechaSuscripcion;
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
  getCalificacion() {
    for (let i = 0; i < this.evaluacionRealizada.Clasificaciones.length; i++) {
      if (this.evaluacionRealizada.ValorFinal >= this.evaluacionRealizada.Clasificaciones[i].LimiteInferior
        && this.evaluacionRealizada.ValorFinal <= this.evaluacionRealizada.Clasificaciones[i].LimiteSuperior) {
        return this.evaluacionRealizada.Clasificaciones[i].Nombre;
      }
    }
  }
}
