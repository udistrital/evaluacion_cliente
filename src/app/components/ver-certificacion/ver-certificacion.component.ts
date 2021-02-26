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
import { EvaluacioncrudService } from "../../@core/data/evaluacioncrud.service";
import Swal from 'sweetalert2';
import { Subscription } from "rxjs";




@Component({
  selector: "ngx-ver-certificacion",
  templateUrl: "./ver-certificacion.component.html",
  styleUrls: ["./ver-certificacion.component.scss"],
})
export class VerCertificacionComponent implements OnInit {
  @ViewChild("contentTemplate", { read: false })
  contentTemplate: TemplateRef<any>;

  @Output() volverFiltro: EventEmitter<Boolean>;
  @Input() dataContrato: any = [];
  @Input() rol: string = "";
  uidDocumento: string;
  idDocumento: number;
  novedad: string;
  objeto: string;
  cedula: string;
  numeroContrato: string;
  tipoCertificacion: string;
  subscription: Subscription;
  nombre: string;

  duracion_contrato: string;

  datosCertficiaciones: any[] = [];
  codigoDocumento: string;

  constructor(
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private evaluacionMidService: EvaluacionmidService,
    private windowService: NbWindowService,

    private evaluacionCrudService: EvaluacioncrudService
  ) {
    this.volverFiltro = new EventEmitter();
  }

  ngOnInit() {
    this.consultarDatosContrato();
  }

  consultarIdCertificaciones() {
    //console.log("rol",this.rol)
    if (this.rol == "CONTRATISTA" || this.rol == "ASISTENTE_JURIDICA"){
      this.tipoCertificacion = "contractual"
      this.documentoService
      .get(
        "documento/?query=Nombre:certificacion_" +
          this.numeroContrato +
          "__" +
          this.cedula +
          "_" + this.tipoCertificacion +
          "&limit=-1"
      )
      .subscribe((data: any) => {
        if (Object.keys(data[0]).length !== 0) {
          this.datosCertficiaciones = data;
        } else {
          this.openWindow('El número del contrato '+this.numeroContrato + " No contiene Certificaciones") 

          this.regresarFiltro();
          
        }
      });
    }else if ( this.rol == "ASISTENTE_COMPRAS"){
      this.tipoCertificacion ="cumplimiento"
      this.documentoService
      .get(
        "documento/?query=Nombre:certificacion_" +
          this.numeroContrato +
          "__" +
          this.cedula +
          "_"+this.tipoCertificacion+
          "&limit=-1"
      )
      .subscribe((data: any) => {
        if (Object.keys(data[0]).length !== 0) {
          this.datosCertficiaciones = data;
        } else {
          
          this.openWindow('El número del contrato ' + this.numeroContrato + " No contiene Certificaciones");
          

          this.regresarFiltro();
          
        }
      });     

    }else if (this.rol == "ORDENADOR_DEL_GASTO" || this.rol == "OPS"){
      //console.log("este es el rol",this.rol)
      this.documentoService
      .get(
        "documento/?query=Nombre:certificacion_" +
          this.numeroContrato +
          "__" +
          this.cedula +
          "_contractual" + ",Nombre:certificacion_" +
          this.numeroContrato +
          "__" +
          this.cedula +
          "_cumplimiento" +
          "&limit=-1"
      )
      .subscribe((data: any) => {
        if (Object.keys(data[0]).length !== 0) {
          this.datosCertficiaciones = data;
        } else {
          this.openWindow('El número del contrato ' + this.numeroContrato + " No contiene Certificaciones");
          
          

          this.regresarFiltro();
          
        }
      });
    }
    
  }
  regresarFiltro() {
    this.volverFiltro.emit(true);
  }
  descargarCertificacion(contrato: any) {
    //console.log("este es el id del certificacion")
    const anObject = {
      Id: contrato.Enlace,
      key: "prueba",
    };
    
    console.log("des");

    const serv = this.nuxeoService
    .getDocumentoOne$(anObject, this.documentoService);
    
    this.subscription = serv.subscribe((response) => {
        //console.log("respuesta 1", response);

        //console.log("respuesta", response["prueba"]);

        this.download(response["prueba"], "", 1000, 1000);
        
      }),
      (error_service) => {
        this.openWindow('No se pudo descargar la certificacion');
        this.regresarFiltro();
      };
      
      
  }
  download(url, title, w, h) {
    
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    window.open(
      url,
      title,
      "toolbar=no," +
        "location=no, directories=no, status=no, menubar=no," +
        "scrollbars=no, resizable=no, copyhistory=no, " +
        'width=' +
        w +
        ', height=' +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
    this.subscription.unsubscribe();
  }

  buscarId(){
    

    this.documentoService
      .get(
        "documento/?query=Enlace:" + this.codigoDocumento
      )
      .subscribe((data: any) => {
        //console.log("datos de el id",data)
        if (Object.keys(data[0]).length !== 0) {
          this.datosCertficiaciones = data;
        } else {
          this.openWindow('El id' + this.numeroContrato + ' No contiene Certificaciones asociadas');

          
          
        }
      }); 

  }

  consultarDatosContrato() {
    this.evaluacionMidService
      .get(
        'datosContrato?NumContrato=' +
          this.dataContrato[0].ContratoSuscrito +
          '&VigenciaContrato=' +
          this.dataContrato[0].Vigencia
      )
      .subscribe((res_contrato) => {
        //console.log("aca esta el contrato", res_contrato); contrato
        this.objeto = res_contrato.Data[0].contrato_general.ObjetoContrato;

        this.cedula = res_contrato.Data[0].informacion_proveedor.NumDocumento;
        //console.log("aca esta la cedula",this.cedula); cedula
        this.nombre = res_contrato.Data[0].informacion_proveedor.NomProveedor;
        this.numeroContrato =
          res_contrato.Data[0].contrato_general.ContratoSuscrito[0].NumeroContratoSuscrito;

        this.consultarIdCertificaciones();
      }),
      (error_service) => {
        this.openWindow(error_service.message);
        this.regresarFiltro();
      };
  }
  openWindow(mensaje) {
    const Swal = require('sweetalert2')
    Swal.fire({
      icon: 'error',
      title: 'ERROR',
      text: mensaje,
      
    });
  }
}
