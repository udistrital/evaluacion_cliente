import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validator, ValidatorFn, Validators } from '@angular/forms';
import { CrearCertificacionesDveService } from '../../services/certificaionesDve/crear-certificaciones-dve.service';
import { CertificacionDveService } from '../../services/certificaionesDve/certificacionesDve.service';
import { async } from '@angular/core/testing';
import { PopUpManager } from '../../managers/popUpManager';

@Component({
  selector: 'ngx-formulario-certificaciones-dve-docente',
  templateUrl: './formulario-certificaciones-dve-docente.component.html',
  styleUrls: ['./formulario-certificaciones-dve-docente.component.scss']
})
export class FormularioCertificacionesDveDocenteComponent implements OnInit {

  @Input() titulo: string;
  formularioCertificacionesDve: FormGroup;
  @Input() nombreDocente: string;
  @Input() documentoDocente: string;

  constructor(
    private fg: FormBuilder,
    private crearCertificado: CrearCertificacionesDveService,
    private certificacionesService: CertificacionDveService,
    private popUpManager:PopUpManager
  ) {
  }

  ngOnInit() {
    this.formularioCertificacionesDve = this.fg.group({
      numero_documento: ["", ],
      periodo_inicial: ["", ],
      periodo_final: ["", ],
      vinculaciones: [[],],
      incluir_salario: [false]
    },);
  this.formularioCertificacionesDve.setValidators(this.validarFecha());
  this.formularioCertificacionesDve.updateValueAndValidity();
  }

  getAniosYPeriodos(): string[] {
    const aniosYperiodo: string[] = [];
    const anioActual = new Date().getFullYear();
    let anioInicial = 2017;

    while (anioInicial <= anioActual) {
      aniosYperiodo.push(anioInicial + "-I");
      aniosYperiodo.push(anioInicial + "-II");
      aniosYperiodo.push(anioInicial + "-III");
      anioInicial++;
    }
    return aniosYperiodo;
  }

  getVinculacion(): string[] {
    const vinculaciones: string[] = [];

    vinculaciones.push("Vinculacion-I");
    vinculaciones.push("Vinculacion-II");
    vinculaciones.push("Vinculacion-II");
    return vinculaciones;
  }

  async submitFormularioDve() {

    if(this.formularioCertificacionesDve.valid){
      try {
        const peticion = this.getPeticion(this.formularioCertificacionesDve);
        const Swal = require("sweetalert2");
        Swal.fire({
          title: "Generando",
          text: "Por favor espera..",
          icon: "success",
          showConfirmButton: false,
        });

        this.certificacionesService
          .getDataCertificactionDve(peticion)
          .subscribe({next:(response) => {
            if(response!==undefined){
            this.crearCertificado.createPfd(
              response,
              this.formularioCertificacionesDve.value.incluir_salario
            );
            }else{
              this.popUpManager.showErrorAlert("Erro al consular");
            }

          },error:(error:any)=>{
            this.popUpManager.showErrorAlert("Error al consultar la información");

          }});
      } catch (error) {}
    }else{
      this.popUpManager.showErrorAlert("Valida el formulario");
    }

  }

  getDataCertificacionesService(peticion: any) {
    return this.certificacionesService.getDataCertificactionDve(peticion);
  }

  getDataCertificacionesServiceTest() {
    return this.certificacionesService.getDataCertificactionDveTest();
  }


  private getPeticion(form: FormGroup) {
    return {
      numero_documento: this.documentoDocente,
      periodo_inicial: form.value.periodo_inicial,
      periodo_final: form.value.periodo_final,
      vinculaciones: form.value.vinculaciones,
      incluir_salario: form.value.incluir_salario,
    };
  }


  validarFecha(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const periodoInicial = this.formularioCertificacionesDve.get("periodo_inicial");
      const periodoFinal = this.formularioCertificacionesDve.get("periodo_final");

      if (periodoInicial && periodoFinal) {
        const periodoInicialValue = periodoInicial.value.split("-");
        const periodoFinalValue = periodoFinal.value.split("-");

        const numeroRomanos = {
          I: 1,
          II: 2,
          III: 3
        };

        if (periodoInicialValue.length > 1 && periodoFinalValue.length > 1) {
          const periodoInicialValor = parseInt(periodoInicialValue[0], 10);
          const periodoFinalValor = parseInt(periodoFinalValue[0], 10);

          if (periodoInicialValor > periodoFinalValor) {
            return { rangoValido: true };

          }else{
            if( numeroRomanos[periodoInicialValue[1]]>numeroRomanos[periodoFinalValue[1]]){
              return { rangoValido: true };
            }
          }
        }
      }

      return null;
    };
  }




}


