import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-tabla-busqueda',
  templateUrl: './tabla-busqueda.component.html',
  styleUrls: ['./tabla-busqueda.component.scss'],
})
export class TablaBusquedaComponent implements OnInit {
  @Input() dataContratos: any = [];
  @Output() dataToDo: any = {};
  @Output() dataView: any = {};

  constructor() {
    this.dataToDo = new EventEmitter();
    this.dataView = new EventEmitter();
  }

  ngOnInit() {
  }

  realizarEvaluacion(data: any) {
    this.dataToDo.emit(data);
  }

  verEvaluacion(data: any) {
    this.dataView.emit(data);
  }

}
