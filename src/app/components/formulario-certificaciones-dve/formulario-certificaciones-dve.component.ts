import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CrearCertificacionesDveService } from "./../../services/certificaionesDve/crear-certificaciones-dve.service";
import { CertificacionDveService } from "./../../services/certificaionesDve/certificacionesDve.service";
import { error, info } from "console";
import { InformacionCertificacionDve } from "../../@core/data/models/certificacionesDve/informacionCertificacionDve";

@Component({
  selector: "ngx-formulario-certificaciones-dve",
  templateUrl: "./formulario-certificaciones-dve.html",
  styleUrls: ["./formulario-certificaciones-dve.scss"],
})
export class FormularioCertificacionesDveComponent implements OnInit {
  @Input() titulo: string;
  formularioCertificacionesDve: FormGroup;
  @Input() nombreDocente: string;
  @Input() documentoDocente: string;

  constructor(
    private fg: FormBuilder,
    private crearCertificado: CrearCertificacionesDveService,
    private certificacionesService: CertificacionDveService
  ) {
    crearCertificado = new CrearCertificacionesDveService();
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

      const Swal = require("sweetalert2");
      Swal.fire({
        title: "Descargando",
        text: "Por favor espera..",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      this.certificacionesService
        .getDataCertificactionDve(peticion)
        .subscribe((response) => {
          this.crearCertificado.createPfd(
            response,
            this.formularioCertificacionesDve.value.incluirSalario
          );
        });
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
