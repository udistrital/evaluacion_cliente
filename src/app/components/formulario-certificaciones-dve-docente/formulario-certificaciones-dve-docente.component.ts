import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrearCertificacionesDveService } from '../../services/certificaionesDve/crear-certificaciones-dve.service';
import { CertificacionDveService } from '../../services/certificaionesDve/certificacionesDve.service';

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
      documentoDocente: 88194457,
      anioInicio: "",
      anioFin: "",
      tipoVinculacion: "",
      incluirSalario: false,
    });
  }

  getAniosYPeriodos(): string[] {
    let aniosYperiodo: string[] = [];
    let anioActual = new Date().getFullYear();
    let anioInicial = 2017;

    while (anioInicial < anioActual) {
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

  submitFormularioDve() {
    try {
      let peticion = this.getPeticion(this.formularioCertificacionesDve);

      console.log(peticion)
      const Swal = require("sweetalert2");
      Swal.fire({
        title: "Descargando",
        text: "Por favor espera..",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      // this.certificacionesService
      //   .getDataCertificactionDve(peticion)
      //   .subscribe((response) => {
      //     this.crearCertificado.createPfd(
      //       response,
      //       this.formularioCertificacionesDve.value.incluirSalario
      //     );
      //   });
      this.crearCertificado.createPfd(
        this.certificacionesService
    .getDataCertificactionDveTest(),
        this.formularioCertificacionesDve.value.incluirSalario
      );
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
      numero_documento: "88194457",
      periodo_inicial: form.value.anioInicio,
      periodo_final: form.value.anioFin,
      vinculaciones: form.value.tipoVinculacion,
    };
  }



}
