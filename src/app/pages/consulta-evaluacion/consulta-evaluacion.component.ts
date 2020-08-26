import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { EvaluacionmidService } from '../../@core/data/evaluacionmid.service';


@Component({
  selector: 'ngx-consulta-evaluacion',
  templateUrl: './consulta-evaluacion.component.html',
  styleUrls: ['./consulta-evaluacion.component.scss'],
})
export class ConsultaEvaluacionComponent implements OnInit {

  identificacionProveedor: any;
  tipodocumento: any;
  // data: any;
  /*Se guarda los datos que envía el componente filtro*/
  data: any;
  /*Variables que guardan los datos que envía el componente tabla-busqueda*/
  datosContratoAVer: any;
  datosContratoAEvaluar: any;
  /*Varible para saber si debe mostrar o no el componente ver*/
  componenteVer: boolean;
  /*Varible para saber si debe mostrar o no el componente ver*/
  componenteRealizar: boolean;
  @ViewChild('contentTemplate', { read: false }) contentTemplate: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private windowService: NbWindowService,
    private evaluacionMidService: EvaluacionmidService,
    ) {
      this.data = [];
    this.datosContratoAVer = [];
    this.datosContratoAEvaluar = [];
      this.componenteRealizar = false;
      this.componenteVer = false;
      this.activatedRoute.params.subscribe( params => {
        this.identificacionProveedor = params['IdentificacionProveedor'];
        this.tipodocumento = params['TipoDocumento'];

      } );
     }

  ngOnInit() {
    this.evaluacionMidService.get(`filtroProveedor?ProvID=${this.identificacionProveedor}&SupID=0` )
        .subscribe((res) => {
          if (res !== null) {
            this.data = res;
          }
        }, (error_service) => {
          this.openWindow(error_service['body'][1]['Error']);
          this.data = [];
        });
  }

  openWindow(mensaje) {
    this.windowService.open(
      this.contentTemplate,
      { title: 'Alerta', context: { text: mensaje } },
    );
  }

  habilitarFiltro(data: any) {
    if (data === true ) {
      this.componenteVer = false;
      this.componenteRealizar = false;
    }
  }

  verEvaluacion(data: any) {
    this.datosContratoAVer[0] = data;
    this.componenteVer = true;
  }

  relizarEvaluacion(data: any) {
    this.datosContratoAEvaluar[0] = data;
    this.componenteRealizar = true;
  }

}
