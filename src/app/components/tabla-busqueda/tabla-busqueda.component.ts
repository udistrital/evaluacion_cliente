import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthGuard } from '../../@core/_guards/auth.guard';


@Component({
  selector: 'ngx-tabla-busqueda',
  templateUrl: './tabla-busqueda.component.html',
  styleUrls: ['./tabla-busqueda.component.scss'],
})
export class TablaBusquedaComponent implements OnInit {
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
    if (this.authGuard.validacion()) {
      this.logueado = true;
    }
  }

  realizarEvaluacion(data: any) {
    this.dataToDo.emit(data);
  }

  verEvaluacion(data: any) {
    this.dataView.emit(data);
  }

}
