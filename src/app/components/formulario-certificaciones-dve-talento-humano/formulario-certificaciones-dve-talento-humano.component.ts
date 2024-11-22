import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from '../../managers/popUpManager';

@Component({
  selector: 'ngx-formulario-certificaciones-dve-talento-humano',
  templateUrl: './formulario-certificaciones-dve-talento-humano.component.html',
  styleUrls: ['./formulario-certificaciones-dve-talento-humano.component.scss'],
})
export class FormularioCertificacionesDveTalentoHumanoComponent implements OnInit {

  formularioCertificacionesDveTalentoHumano: FormGroup;
  @Input() titulo: string;
  formuarioValido = false;
  constructor(private fg: FormBuilder,private popUpManager:PopUpManager) { }

  ngOnInit() {

    this.formularioCertificacionesDveTalentoHumano = this.fg.group({
      numero_documento:[ "",[Validators.required]] ,
      incluir_salario:  [false],
      });
  }

  submitFormularioCertificacionesDveTalentoHumano() {

    if (this.formularioCertificacionesDveTalentoHumano.valid) {
    console.log(this.formularioCertificacionesDveTalentoHumano.value);
    }else {
      this.formuarioValido=true
      this.popUpManager.showErrorAlert("Valide el formulario")
    }
  }


  eliminarLetras(identificacion:string){
    const soloLetrasYSimbolosRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s!@#$%^&*(),.?":{}|<>_-]+$/;
    if(soloLetrasYSimbolosRegex.test(String(identificacion))){
      identificacion = identificacion.slice(0,-1)
      this.formularioCertificacionesDveTalentoHumano.patchValue({numero_documento:identificacion})
    }
  }


}
