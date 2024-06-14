import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CrearCertificacionesDveService } from './../../services/certificaionesDve/crear-certificaciones-dve.service';
import { CertificacionDveService } from './../../services/certificaionesDve/certificacionesDve.service';

@Component({
  selector: "ngx-formulario-certificaciones-dve",
  templateUrl: "./formulario-certificaciones-dve.html",
  styleUrls: ["./formulario-certificaciones-dve.scss"],
})
export class FormularioCertificacionesDveComponent implements OnInit {

  @Input() titulo: string;
  formularioCertificacionesDve: FormGroup;
  @Input() nombreDocente:string;
  @Input() documentoDocente:string;


  constructor(private fg: FormBuilder,private crearCertificado: CrearCertificacionesDveService,private certificacionesService: CertificacionDveService) {
    crearCertificado = new CrearCertificacionesDveService();
  }

  ngOnInit() {

    this.formularioCertificacionesDve= this.fg.group({
    "anioInicio":"",
    "anioFin":"",
    "tipoVinculacion":"",
    "incluirSalario":false,

    });

    
  }
  nombreUser:string="NombreDeUsuario";
 
  getAniosYPeriodos():string[]{
    let  aniosYperiodo:string[]=[];
    let  anioActual= new Date().getFullYear();
    let  anioInicial=2017;
  
     while(anioInicial<anioActual){
      aniosYperiodo.push(anioInicial+"-I")
      aniosYperiodo.push(anioInicial+"-II")
      aniosYperiodo.push(anioInicial+"-III")
      anioInicial++;
     }
     return aniosYperiodo;
    }
    
    getVinculacion():string[]{
      let  vinculaciones:string[]=[];
    
      vinculaciones.push("Vinculacion-I")
      vinculaciones.push("Vinculacion-II")
      vinculaciones.push("Vinculacion-II")
       return vinculaciones;
      }

  submitFormularioDve(){
    console.log(this.formularioCertificacionesDve.value);
    try{
      this.crearCertificado.createPfd(this.getDataCertificacionesService(),this.formularioCertificacionesDve.value.incluirSalario);
    }catch(errror){
      console.warn(errror);

    }
      console.log(this.formularioCertificacionesDve.value);
    
  }

  getDataCertificacionesService(){
    return this.certificacionesService.getDataCertificactionDveTest();
  
  }



}
