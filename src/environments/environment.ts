/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  GESTOR_DOCUMENTAL_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/gestor_documental_mid/v1/',
  FIRMA_ELECTRONICA_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/firma_electronica_mid/v1/',
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  // NOTIFICACION_SERVICE: 'ws://pruebasapi.intranetoas.udistrital.edu.co:8116/ws',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  // EVALUACIONMID_SERVICE: 'http://pruebasapi2.intranetoas.udistrital.edu.co:8507/v1/',
  EVALUACIONMID_SERVICE: 'localhost:8080/v1/',
   //'https://autenticacion.portaloas.udistrital.edu.co/apioas/evaluacion_mid/v1/',
  // EVALUACIONCRUD_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8506/v1/',
  EVALUACIONCRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/evaluacion_crud/v1/',
  ADMINISTRIVA_AMAZON: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/',
  DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
  NOVEDADES_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8502/v1/',
  ADMINISTRATIVA_JBPM_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/',
  AGORA_SERVICE: "http://api.intranetoas.udistrital.edu.co:8104/v1/",
  DOCUMENTOS_CRUD: "https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/",


  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'e36v1MPQk2jbz9KM4SmKhk8Cyw0a',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role documento',
    REDIRECT_URL: 'http://localhost:4200/',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/',
    AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
  },
};
