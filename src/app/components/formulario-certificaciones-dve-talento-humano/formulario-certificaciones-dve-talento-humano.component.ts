import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from '../../managers/popUpManager';
import { CrearCertificacionesDveService } from '../../services/certificaionesDve/crear-certificaciones-dve.service';
import { CertificacionDveService } from '../../services/certificaionesDve/certificacionesDve.service';
import { error } from 'console';

@Component({
  selector: 'ngx-formulario-certificaciones-dve-talento-humano',
  templateUrl: './formulario-certificaciones-dve-talento-humano.component.html',
  styleUrls: ['./formulario-certificaciones-dve-talento-humano.component.scss'],
})
export class FormularioCertificacionesDveTalentoHumanoComponent implements OnInit {

  formularioCertificacionesDveTalentoHumano: FormGroup;
  @Input() titulo: string;
  formuarioValido = false;
  constructor(private fg: FormBuilder,private popUpManager:PopUpManager, private crearCertificado: CrearCertificacionesDveService,
    private certificacionesService: CertificacionDveService) { }

  ngOnInit() {

    this.formularioCertificacionesDveTalentoHumano = this.fg.group({
      numero_documento:[ "",[Validators.required]] ,
      incluir_salario:  [false],
      });
  }

  submitFormularioCertificacionesDveTalentoHumano() {
    if (this.formularioCertificacionesDveTalentoHumano.valid) {
      
      const peticion = this.getPeticion(this.formularioCertificacionesDveTalentoHumano)
      this.popUpManager.showLoadingAlert("Generando", "Por favor espera un momento");
      this.certificacionesService.getDataCertificactionDve(peticion).subscribe({
        next:(response)=>{
   
          if(response!=undefined){
            this.crearCertificado.createPfd(response,this.formularioCertificacionesDveTalentoHumano.value.incluir_salario)
          }else{
            this.popUpManager.showErrorAlert("Erro al consultar")
          }
        },error:(error)=>{
         if(error.error.Message.Message){
          this.popUpManager.showErrorAlert(error.error.Message.Message)

         }else{ this.popUpManager.showErrorAlert("Erro al generar certificado")}
         
        }
      })
      

    }else {
      this.formuarioValido=true
      this.popUpManager.showErrorAlert("Valide el formulario")
    }
  }



  eliminarLetras(identificacion:string){
    console.log(identificacion)
    const soloNumeros = identificacion.replace(/[^0-9]/g, '');
    this.formularioCertificacionesDveTalentoHumano.patchValue({
      numero_documento: soloNumeros
    });
  }


  private getPeticion(form: FormGroup) {
    return {
      numero_documento: form.value.numero_documento,
      incluir_salario: form.value.incluir_salario,
    };
  }

}
