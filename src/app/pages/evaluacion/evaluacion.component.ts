import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.scss'],
})
export class EvaluacionComponent implements OnInit {
  /*Se guarda los datos que envía el componente filtro*/
  data: any;
  /*Variables que guardan los datos que envía el componente tabla-busqueda*/
  datosContratoAVer: any;
  datosContratoAEvaluar: any;
  /*Varible para saber si debe mostrar o no el componente ver*/
  componenteVer: boolean;
  /*Varible para saber si debe mostrar o no el componente ver*/
  componenteRealizar: boolean;

  constructor() {
    this.data = [];
    this.datosContratoAVer = [];
    this.datosContratoAEvaluar = [];
   }

  ngOnInit() {
    this.componenteVer = false;
    this.componenteRealizar = false;
  }
  /*Guardo los datos de la consulta obtenida creada por el filtro*/
  guardarDatosConsulta(data: any) {
    this.data = data;
  }

  /*Guarda los datos de la fila selecionada en el componente tabla-busqueda en la variable datosContratoAVer
   y habilita el componente ver-evaluacion*/
  verEvaluacion(data: any) {
    this.datosContratoAVer[0] = data;
    this.componenteVer = true;
  }

  /*Guarda los datos de la fila selecionada en el componente tabla-busqueda en la variable datosContratoAVer
   y habilita el componente realizar-evaluacion*/
  relizarEvaluacion(data: any) {
    this.datosContratoAEvaluar[0] = data;
    this.componenteRealizar = true;
  }

  /*Asigna a las variables componenteVer y componenteRealizar false para deshabilitar el componente ver-evaluacion
   y realizar-evaluacion*/
  habilitarFiltro(data: any) {
    if (data === true ) {
      this.componenteVer = false;
      this.componenteRealizar = false;
    }
  }
}
