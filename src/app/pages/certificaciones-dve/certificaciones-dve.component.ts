import { Component, OnInit } from '@angular/core';
import { Documento } from './../../@core/data/models/documento';
import { platform } from 'os';

@Component({
  selector: 'certificaciones-dve',
  templateUrl: './certificaciones-dve.component.html',
  styleUrls: ['./certificaciones-dve.component.scss'],
})
export class CertificacionesDveComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  this.getToken();
  }

   docente= {
    'documentoDocente': '',
    'nombreDocente': '',
  };
  titulo: string = 'Titulo';

  private getToken = () => {
    if (window.localStorage.getItem('id_token') !== null) {
      const token = window.localStorage.getItem('id_token');
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      this.docente.documentoDocente = payload.documento;
      this.docente.nombreDocente = payload.sub.toUpperCase();
    }
  }
}
