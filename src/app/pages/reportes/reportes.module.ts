import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { RegistroEntradasComponent } from './registro-entradas/registro-entradas.component';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  declarations: [ReportesComponent, RegistroEntradasComponent],
  imports: [
    CommonModule,
    ThemeModule,
    ToasterModule,
    ReportesRoutingModule,
  ],
})
export class ReportesModule { }
