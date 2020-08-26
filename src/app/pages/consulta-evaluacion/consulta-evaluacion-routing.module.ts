import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaEvaluacionComponent } from './consulta-evaluacion.component';

const routes: Routes = [{
  path: '',
  component: ConsultaEvaluacionComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaEvaluacionRoutingModule { }
