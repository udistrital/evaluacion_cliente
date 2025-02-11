import { Injectable } from '@angular/core';
import { RequestManager } from '../../managers/requestManager';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private rqManager: RequestManager,
    ) { }

    getDocumentoUser() {
        const userString = window.localStorage.getItem('user');
        if (!userString || !userString.length) {
            return '';
        }

        const user = atob(userString);
        if (!user) {
            return '';
        }

        const userObj = JSON.parse(atob(userString));

        if (!userObj || !userObj.userService || !userObj.userService.documento) {
            return '';
        }

        return userObj.userService.documento;
    }

    getPersonaNaturalAmazon() {

        const documento = this.getDocumentoUser();
        if (!documento.length) {
            return;
        }

        const payload = '?fields=Id,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido,TipoDocumento,Cargo&' + 'query=Id:' + documento;

        return this.getAllInfoPersonaNatural(payload);
    }

    getAllInfoPersonaNatural(payload) {
        const path = 'informacion_persona_natural';
        this.rqManager.setPath('ADMINISTRIVA_AMAZON');
        return this.rqManager.get(path + payload).pipe(
            map(
                (res) => {
                    if (!res || !res.length) {
                        return [];
                    }
                    return res;
                },
            ),
        );
    }

    fillRepresentante(rep: any) {
        return {
            nombre: rep.PrimerNombre.concat(' ', rep.SegundoNombre).concat(' ', rep.PrimerApellido).concat(' ', rep.SegundoApellido),
            cargo: rep.Cargo,
            tipoId: rep.TipoDocumento.Abreviatura,
            identificacion: rep.Id,
        };
    }
    public getPayload(): any {
        var payload: any = {};
        const idToken = window.localStorage.getItem('id_token').split('.');
        if (idToken != undefined) {
          payload = JSON.parse(atob(idToken[1]));
        }
        return payload;
      }

}
