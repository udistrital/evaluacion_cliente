import {interval as observableInterval,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as auth from 'oidc-auth/index.js';

@Injectable({
    providedIn: 'root',
})
export class ImplicitAutenticationService {
    bearer: { headers: HttpHeaders; };

    init(): void {
    }

    public session = null;
    public payload: any;

    constructor() {
        this.bearer = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'authorization': 'Bearer ' + window.localStorage.getItem('access_token'),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }),
        };
        auth.setGeneral(environment.TOKEN);
    }

    public logout() {
        auth.logout();
    }

    getPayload() {
        return auth.getPayload();
    }

    public live() {
      if (auth.live(true)) {
        auth.liveToken();
        return true;
      } else {
        return false;
      }
    }

    public getAuthorizationUrl(button): string {
        return  auth.live(button);
    }

}
