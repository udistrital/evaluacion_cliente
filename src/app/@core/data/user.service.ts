import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { RequestManager } from '../../managers/requestManager';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private rqManager: RequestManager,
    ) { }

    getPersonaNaturalAmazon() {

        const userString = window.localStorage.getItem('user');
        if (!userString || !userString.length) {
            return;
        }

        const user = atob(userString);
        if (!user) {
            return;
        }

        const userObj = JSON.parse(atob(userString));

        if (!userObj || !userObj.userService || !userObj.userService.documento) {
            return;
        }

        const payload = '?fields=Id,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido,TipoDocumento,Cargo&' +
            'query=Id:' + userObj.userService.documento;

        return this.getAllInfoPersonaNatural(payload);
    }

    getAllInfoPersonaNatural(payload) {
        const path = 'informacion_persona_natural';
        this.rqManager.setPath('ADMINISTRIVA_AMAZON');
        return this.rqManager.get(path + payload).pipe(
            map(
                (res) => {
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

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError({
            status: error.status,
            message: 'Something bad happened; please try again later.',
        });
    }
}
