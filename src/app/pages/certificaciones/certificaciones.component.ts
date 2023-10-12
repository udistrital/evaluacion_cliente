import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../@core/_guards/auth.guard';

@Component({
  selector: 'ngx-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
})
export class CertificacionesComponent implements OnInit {
  titulo: string = 'Certificaciones';
  /* se guarda el rol actual*/
  rolActual: any;

  /*Se guarda los datos que envía el componente filtro*/
  data: any;
  /*Variables que guardan los datos que envía el componente tabla-busqueda*/
  datosContratoAVer: any;
  datosContratoAEvaluar: any;
  /*Varible para saber si debe mostrar o no el componente ver*/
  componenteVer: boolean;
  /*Varible para saber si debe mostrar o no el componente ver*/
  componenteRealizar: boolean;
  /*Varible para saber si debe mostrar o no el componente ver*/
  componenteRealizarCertificacion: boolean;

  constructor(private authGuard: AuthGuard) {
    this.data = [];
    this.datosContratoAVer = [];
    this.datosContratoAEvaluar = [];
  }

  ngOnInit() {
    this.rolActual = this.authGuard.rolActual();
    // console.log("Este es el rol",this.rolActual)
    this.componenteVer = false;
    this.componenteRealizar = false;
    this.componenteRealizarCertificacion = false;
  }
  /*Guardo los datos de la consulta obtenida creada por el filtro*/
  guardarDatosConsulta(data: any) {
    this.data = data;
  }

  /*Guarda los datos de la fila selecionada en el componente tabla-busqueda en la variable datosContratoAVer
   y habilita el componente ver-certificacion*/
  verCertificacion(data: any) {
    this.datosContratoAVer[0] = data;
    this.componenteVer = true;
  }

  /*Guarda los datos de la fila selecionada en el componente tabla-busqueda en la variable datosContratoAVer
   y habilita el componente realizar-certificacion*/
  relizarCertificacion(data: any) {
    // console.log("esta es la data", data);

    this.datosContratoAEvaluar[0] = data;
    this.componenteRealizar = true;
  }
  relizarCertificacionSinNovedad(data: any) {
    this.datosContratoAEvaluar[0] = data;
    this.componenteRealizarCertificacion = true;
  }

  /*Asigna a las variables componenteVer y componenteRealizar false para deshabilitar el componente ver-certificacion
   y realizar-certificacion*/
  habilitarFiltro(data: any) {
    if (data === true) {
      this.componenteVer = false;
      this.componenteRealizar = false;
      this.componenteRealizarCertificacion = false;
    }
  }
}
