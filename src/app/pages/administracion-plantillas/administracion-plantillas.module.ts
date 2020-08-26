import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionPlantillasRoutingModule } from './administracion-plantillas-routing.module';
import { AdministracionPlantillasComponent } from './administracion-plantillas.component';

@NgModule({
  declarations: [AdministracionPlantillasComponent],
  imports: [
    CommonModule,
    AdministracionPlantillasRoutingModule,
  ],
})
export class AdministracionPlantillasModule { }
