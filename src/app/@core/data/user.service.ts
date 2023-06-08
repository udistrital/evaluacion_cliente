import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
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

}
