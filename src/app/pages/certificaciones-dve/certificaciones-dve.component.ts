import { Component, OnInit } from '@angular/core';
import { Documento } from './../../@core/data/models/documento';
import { platform } from 'os';
import { error } from 'console';
import { UserService } from '../../@core/data/user.service';

@Component({
  selector: 'ngx-certificaciones-dve',
  templateUrl: './certificaciones-dve.component.html',
  styleUrls: ['./certificaciones-dve.component.scss'],
})
export class CertificacionesDveComponent implements OnInit {
  constructor(private userService:UserService) {}

  ngOnInit() {
  this.getToken();
  this.obtenerNombreDocente()
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

  obtenerNombreDocente(): Promise<void>{
    try{
       return new Promise((resolve,reject)=>{
        this.userService.getPersonaNaturalAmazon().subscribe(
          {next:(response:any)=>{
           if(response  && response.length>0){
            const data = response[0];
           this.docente.nombreDocente = data.PrimerNombre + " " +data.PrimerApellido + " " +data.SegundoApellido 
           }
          }}
        )
       })
    }catch(error){
        console.error("Error al consultar el nombre del docente")
    }

  }
}
