import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluarProveedorRoutingModule } from './evaluar-proveedor-routing.module';
import { EvaluarProveedorComponent } from './evaluar-proveedor.component';

@NgModule({
  declarations: [EvaluarProveedorComponent],
  imports: [
    CommonModule,
    EvaluarProveedorRoutingModule,
  ],
})
export class EvaluarProveedorModule { }
