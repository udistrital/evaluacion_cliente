
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthGuard } from '../../@core/_guards/auth.guard';

@Component({
  selector: 'ngx-tabla-busqueda-certificacion',
  templateUrl: './tabla-busqueda-certificacion.component.html',
  styleUrls: ['./tabla-busqueda-certificacion.component.scss']
})
export class TablaBusquedaCertificacionComponent implements OnInit {
  rolActual: any;
  @Input() dataContratos: any = [];
  @Output() dataToDo: any = {};
  @Output() dataView: any = {};
  logueado: boolean = false;


  constructor(
    private authGuard: AuthGuard,
  ) {
    this.dataToDo = new EventEmitter();
    this.dataView = new EventEmitter();

  }

  ngOnInit() {
    this.rolActual = this.authGuard.rolActual();
    if (this.authGuard.validacion()) {
      this.logueado = true;
    }
  }

  relizarCertificacion(data: any) {
    this.dataToDo.emit(data);
  }

  verCertificacion(data: any) {    
    
    this.dataView.emit(data);
  }
  

}