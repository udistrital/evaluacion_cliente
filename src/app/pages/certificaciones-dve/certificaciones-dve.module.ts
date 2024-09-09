import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificacionesDveRoutingModule } from './certificaciones-dve-routing.module';
import { CertificacionesDveComponent } from './certificaciones-dve.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [CertificacionesDveComponent],
  imports: [CommonModule, CertificacionesDveRoutingModule, ThemeModule],
})
export class CertificacionesDveModule {}


