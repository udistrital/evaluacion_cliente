import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificacionesRoutingModule } from './certificaciones-routing.module';
import { CertificacionesComponent } from './certificaciones.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [CertificacionesComponent],
  imports: [
    CommonModule,
    CertificacionesRoutingModule,
    ThemeModule
  ]
})
export class CertificacionesModule { }
