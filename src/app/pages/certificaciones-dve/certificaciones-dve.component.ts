import { Component, OnInit } from '@angular/core';
import { Documento } from './../../@core/data/models/documento';
import { platform } from 'os';
import { error } from 'console';
import { UserService } from '../../@core/data/user.service';
import { CertificacionDveService } from '../../services/certificaionesDve/certificacionesDve.service';

@Component({
  selector: 'ngx-certificaciones-dve',
  templateUrl: './certificaciones-dve.component.html',
  styleUrls: ['./certificaciones-dve.component.scss'],
})


export class CertificacionesDveComponent implements OnInit {
  menuTalentoHumano:boolean=false;
  menuDocente:boolean=false;
  constructor(private userService:UserService,private certificacionesDveService:CertificacionDveService) {}

  async ngOnInit() {
   await this.getToken();
  this.habilitarMenu();
  }

   docente= {
    'documentoDocente': '',
    'nombreDocente': '',
  };
  titulo: string = 'Titulo';

    async  getToken ()  {
    if (window.localStorage.getItem('id_token') !== null) {
      const token = window.localStorage.getItem('id_token');
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      this.docente.documentoDocente = payload.documento;
     this.docente.nombreDocente =  await this.certificacionesDveService.obtenerNombreDocente();
    }
  }



  obtenerRoles():string[]{
    return this.userService.getPayload().role;
  }

  habilitarMenu(){

    const esTalentoHumano = this.obtenerRoles().includes("TALENTO_HUMANO") ;
    const esDocente  = this.obtenerRoles().includes("DOCENTE");
    this.menuTalentoHumano =  esTalentoHumano ;
    this.menuDocente= esDocente && !esTalentoHumano;

  }


  eliminarLetras(identificacion:string){
    const soloLetrasYSimbolosRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s!@#$%^&*(),.?":{}|<>_-]+$/;

    if(soloLetrasYSimbolosRegex.test(String(identificacion))){

    }
  }

}
