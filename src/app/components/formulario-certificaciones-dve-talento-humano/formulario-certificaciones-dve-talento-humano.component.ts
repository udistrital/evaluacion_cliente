import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-formulario-certificaciones-dve-talento-humano',
  templateUrl: './formulario-certificaciones-dve-talento-humano.component.html',
  styleUrls: ['./formulario-certificaciones-dve-talento-humano.component.scss'],
})
export class FormularioCertificacionesDveTalentoHumanoComponent implements OnInit {

  formularioCertificacionesDveTalentoHumano: FormGroup;
  @Input() titulo: string;

  constructor(private fg: FormBuilder) { }

  ngOnInit() {

    this.formularioCertificacionesDveTalentoHumano = this.fg.group({
      'documentoDocente': '',
      'incluirSalario': '',
      });
  }

  submitFormularioCertificacionesDveTalentoHumano() {
    if (this.formularioCertificacionesDveTalentoHumano.valid) {
      console.log(this.formularioCertificacionesDveTalentoHumano.value);
    }else {
      console.log('verificar formulario');
    }
  }



}
