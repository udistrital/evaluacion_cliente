import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluarProveedorComponent } from './evaluar-proveedor.component';

const routes: Routes = [{
  path: '',
  component: EvaluarProveedorComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluarProveedorRoutingModule { }
