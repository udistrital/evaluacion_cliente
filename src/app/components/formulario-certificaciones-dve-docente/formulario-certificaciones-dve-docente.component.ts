import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrearCertificacionesDveService } from '../../services/certificaionesDve/crear-certificaciones-dve.service';
import { CertificacionDveService } from '../../services/certificaionesDve/certificacionesDve.service';
import { error } from 'console';
import { async } from '@angular/core/testing';

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
    private certificacionesService: CertificacionDveService
  ) {
  }

  ngOnInit() {
    this.formularioCertificacionesDve = this.fg.group({
      numero_documento:[{ value: "", require:true}] ,
      periodo_inicial:[{ value: "", require:true}] ,
      periodo_final: [{ value: "", require:true}] ,
      vinculaciones: [{ value: []}],
      incluir_salario: false,
    });
  }

  getAniosYPeriodos(): string[] {
    let aniosYperiodo: string[] = [];
    let anioActual = new Date().getFullYear();
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
    let vinculaciones: string[] = [];

    vinculaciones.push("Vinculacion-I");
    vinculaciones.push("Vinculacion-II");
    vinculaciones.push("Vinculacion-II");
    return vinculaciones;
  }

  async submitFormularioDve() {

    try {
      let peticion = this.getPeticion(this.formularioCertificacionesDve);
      const Swal = require("sweetalert2");
      Swal.fire({
        title: "Generando",
        text: "Por favor espera..",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      this.certificacionesService
        .getDataCertificactionDve(peticion)
        .subscribe((response) => {
          console.log("response desde el sercvio2 ",response)
          this.crearCertificado.createPfd(
            response,
            this.formularioCertificacionesDve.value.incluirSalario
          );
        });
    //   this.crearCertificado.createPfd(
    //     this.certificacionesService
    // .getDataCertificactionDveTest(),
    //     this.formularioCertificacionesDve.value.incluirSalario
    //   );
    } catch (error) {}

  }

  getDataCertificacionesService(peticion: any) {
    return this.certificacionesService.getDataCertificactionDve(peticion);
  }

  getDataCertificacionesServiceTest() {
    return this.certificacionesService.getDataCertificactionDveTest();
  }


  private getPeticion(form: FormGroup) {
    return {
      numero_documento: "79362769",
      periodo_inicial: form.value.periodo_inicial,
      periodo_final: form.value.periodo_final,
      vinculaciones: form.value.vinculaciones,
      incluir_salario: form.value.incluir_salario,
    };
  }





}


