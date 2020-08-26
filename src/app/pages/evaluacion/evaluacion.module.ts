import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluacionRoutingModule } from './evaluacion-routing.module';
import { EvaluacionComponent } from './evaluacion.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [
    EvaluacionComponent,
  ],
  imports: [
    CommonModule,
    EvaluacionRoutingModule,
    ThemeModule,
  ],
})
export class EvaluacionModule { }
