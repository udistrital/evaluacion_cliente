import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export class FooterComponent {

  universidad: any;
  normatividad: any;
  recomendados: any;
  contactenos: any;
  final: any;
  copyright: any;
  social: any;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.social = {
      list: [{
        title: 'Horario',
        class: 'fas fa-clock',
        value: ['Lunes a viernes', '8 a. m. a 5 p. m.'],
      }, {
        title: 'Nombre',
        class: 'fas fa-globe-americas',
        value: ['Gestión de los Sistemas de la Información y las Telecomunicaciones'],
      }, {
        title: 'Phone',
        class: 'fas fa-phone',
        value: ['323 93 00', 'Ext(s). Secretaría: 1109, Soporte 1111 - 1112'],
      }, {
        title: 'Direccion',
        class: 'fas fa-map-marker-alt',
        value: ['Calle 13 31 75'],
      }, {
        title: 'mail',
        class: 'fas fa-at',
        value: ['computo@udistrital.edu.co'],
      },
    ],
    };
  }
}
