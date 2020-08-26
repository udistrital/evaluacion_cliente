import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportesComponent } from './reportes.component';
import { RegistroEntradasComponent } from './registro-entradas/registro-entradas.component';

const routes: Routes = [{
  path: '',
  component: ReportesComponent,
  children: [{
    path: 'registro-entradas',
    component: RegistroEntradasComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule { }
