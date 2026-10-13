/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// autenticacion.clearUrl();

// Mientras el aviso esté activo, no iniciar la aplicación ni sus rutas de acceso.
if (!document.getElementById('maintenance-notice')) {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}
