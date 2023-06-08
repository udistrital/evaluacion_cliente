
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuService } from '../../@core/data/menu.service';

@Component({
  selector: 'ngx-tabla-busqueda-certificacion',
  templateUrl: './tabla-busqueda-certificacion.component.html',
  styleUrls: ['./tabla-busqueda-certificacion.component.scss'],
})
export class TablaBusquedaCertificacionComponent implements OnInit {
  rolActual: any;
  @Input() dataContratos: any = [];
  @Output() dataToDo: any = {};
  @Output() dataToDo2: any = {};
  @Output() dataView: any = {};
  permisoContractual: boolean = false;
  permisoCumplimiento: boolean = false;

  constructor(
    private menuService: MenuService,
  ) {
    this.dataToDo = new EventEmitter();
    this.dataToDo2 = new EventEmitter();
    this.dataView = new EventEmitter();
  }

  ngOnInit() {
    this.getPermisos();
  }

  private getPermisos() {
    this.permisoContractual = !!this.menuService.getAccion('Certificación contractual');
    this.permisoCumplimiento = !!this.menuService.getAccion('Certificación de cumplimiento');
  }

  relizarCertificacion(data: any) {
    this.dataToDo.emit(data);
  }
  relizarCertificacionSinNovedad(data: any) {
    this.dataToDo2.emit(data);
  }

  verCertificacion(data: any) {
    this.dataView.emit(data);
  }

}
