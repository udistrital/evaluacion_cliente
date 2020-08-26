import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluacionComponent } from './evaluacion.component';

const routes: Routes = [{
  path: '',
  component: EvaluacionComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluacionRoutingModule { }
