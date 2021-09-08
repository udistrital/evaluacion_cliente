import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificacionesComponent } from './certificaciones.component';

const routes: Routes = [{
  path: '',
  component: CertificacionesComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificacionesRoutingModule { }
