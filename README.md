# evaluacion_cliente


El aplicativo tiene la funcionalidad de proveer la gestion de las evaluaciones de los proveedores, en el cual se podran buscar las evaluaciones en base al numero de contrato o el numero de identificacion del proveedor.

Cliente para el subsistema de Evaluación de Pproveedores AGORA.

## Especificaciones Técnicas

### Tecnologías Implementadas y Versiones
* [ngxAdmin](https://github.com/akveo/ngx-admin)
* [Angular 8.0](https://angular.io/)
* [Bootstrap 4](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
* [Nebular 4](https://akveo.github.io/nebular/4.6.0/)


### Variables de Entorno
```shell
# En Pipeline
SLACK_AND_WEBHOOK: WEBHOOK de Slack Grupo ci-covid-serverles
AWS_ACCESS_KEY_ID: llave de acceso ID Usuario AWS
AWS_SECRET_ACCESS_KEY: Secreto de Usuario AWS
```

### Ejecución del Proyecto

Clonar el proyecto del repositorio de git
```bash
# clone the project
git clone https://github.com/udistrital/evaluacion_cliente.git
# enter the project directory
cd evaluacion_cliente
```
Iniciar el servidor en local
```bash
# install dependency
npx npm install
or
npm install
# start server
npx ng serve
# Whenever you want to change the port just run
npx ng dev --port = 9528
```

Linter
```bash
# Angular linter
npm run lint
# run linter and auto fix
npm run lint:fix
# run linter on styles
npm run lint:styles
# run lint UI
npm run lint:ci
```

### Ejecución Dockerfile
```bash
# Does not apply
```
### Ejecución docker-compose
```bash
# Does not apply
```
### Ejecución Pruebas

Pruebas unitarias powered by Jest
```bash
# run unit test
npm run test
# Runt linter + unit test
npm run test:ui
```
## Mockups
Los siguientes mockups representan la estructura general de la aplicación, módulos, submódulos, estructura de información en vista formulario y vista tabla.

[Para visualizar los mockups acceder a este enlace](https://drive.google.com/file/d/1LR9DwzfaFSoEmWc4PWOIicGhS6XIxRrd/view?usp=sharing)


## Dependencias Utilizadas

**API MID**
- [Evaluacion MID](https://github.com/udistrital/evaluacion_mid)

**API CRUD**
- [Evaluacion CRUD](https://github.com/udistrital/evaluacion_crud)


## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
| [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/evaluacion_cliente/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/evaluacion_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/evaluacion_cliente/status.svg?ref=refs/heads/release/0.0.1)](https://hubci.portaloas.udistrital.edu.co/udistrital/evaluacion_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/evaluacion_cliente/status.svg)](https://hubci.portaloas.udistrital.edu.co/udistrital/evaluacion_cliente) |


## Licencia

This file is part of evaluacion_cliente.

evaluacion_cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (atSara Sampaio your option) any later version.

evaluacion_cliente is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with evaluacion_cliente. If not, see https://www.gnu.org/licenses/.
