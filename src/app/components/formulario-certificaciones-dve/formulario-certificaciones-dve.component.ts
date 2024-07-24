import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-formulario-certificaciones-dve',
  templateUrl: './formulario-certificaciones-dve.html',
  styleUrls: ['./formulario-certificaciones-dve.scss'],
})
export class FormularioCertificacionesDveComponent implements OnInit {

  @Input() titulo: string;
  formularioCertificacionesDve: FormGroup;
  @Input() nombreDocente: string;
  @Input() documentoDocente: string;


  constructor(private fg: FormBuilder) {}

  ngOnInit() {

    this.formularioCertificacionesDve = this.fg.group({
    'anioInicio': '',
    'anioFin': '',
    'tipoVinculacion': '',
    'incluirSalario': '',

    });


  }
  nombreUser: string= 'NombreDeUsuario';

  getAniosYPeriodos(): string[] {
    const aniosYperiodo: string[] = [];
    const anioActual = new Date().getFullYear();
    let anioInicial = 2017;

     while (anioInicial < anioActual) {
      aniosYperiodo.push(anioInicial + '-I');
      aniosYperiodo.push(anioInicial + '-II');
      aniosYperiodo.push(anioInicial + '-III');
      anioInicial++;
     }
     return aniosYperiodo;
    }

    getVinculacion(): string[] {
      const vinculaciones: string[] = [];

      vinculaciones.push('Vinculacion-I');
      vinculaciones.push('Vinculacion-II');
      vinculaciones.push('Vinculacion-II');
       return vinculaciones;
      }

  submitFormularioDve() {
    if (this.formularioCertificacionesDve.valid) {
      console.log(this.formularioCertificacionesDve.value);
    }else {
      console.log('verificar formulario');
    }
  }
}
