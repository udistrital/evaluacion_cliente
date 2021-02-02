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

@Component({
  selector: 'ngx-ver-certificacion',
  templateUrl: './ver-certificacion.component.html',
  styleUrls: ['./ver-certificacion.component.scss']
})
export class VerCertificacionComponent implements OnInit {
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
  datosCertficiaciones: any[]=[]
  
 
  
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
    this.consultarDatosContrato();
    
    
    
   
  }
  regresarFiltro() {
    this.volverFiltro.emit(true);
  }

  consultarIdCertificaciones(){

    this.documentoService.get('documento/?query=Nombre:certificacion_'+this.numeroContrato+"__"+this.cedula).subscribe((data : any ) => {
      //console.log(data); data 
      this.datosCertficiaciones = data


    });

  }
  descargarCertificacion(contrato : any){
    //console.log("este es el id del certificacion")
    const anObject = {
      Id:contrato.Enlace,
      key:"prueba"
      
    }
    
    this.nuxeoService.getDocumentoOne$(anObject,this.documentoService).subscribe((response ) => {
      
      console.log("respuesta",response['prueba'])


      this.download(response['prueba'],"",500,500);

     


    })

  }
  download(url, title, w, h) {
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    window.open(url, title, 'toolbar=no,' +
      'location=no, directories=no, status=no, menubar=no,' +
      'scrollbars=no, resizable=no, copyhistory=no, ' +
      'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
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
        //console.log("aca esta el contrato", res_contrato); contrato
        this.objeto = res_contrato[0].contrato_general.ObjetoContrato;
        this.valorContrato = res_contrato[0].contrato_general.ValorContrato;
        this.cedula = res_contrato[0].informacion_proveedor.NumDocumento;
        //console.log("aca esta la cedula",this.cedula); cedula
        this.nombre = res_contrato[0].informacion_proveedor.NomProveedor;
        this.numeroContrato =
          res_contrato[0].contrato_general.ContratoSuscrito[0].NumeroContratoSuscrito;
        this.fecha_suscrip =
          res_contrato[0].contrato_general.ContratoSuscrito[0].FechaSuscripcion;

          this.consultarIdCertificaciones();

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
