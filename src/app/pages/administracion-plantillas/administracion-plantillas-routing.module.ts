import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracionPlantillasComponent } from './administracion-plantillas.component';

const routes: Routes = [{
  path: '',
  component: AdministracionPlantillasComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionPlantillasRoutingModule { }
