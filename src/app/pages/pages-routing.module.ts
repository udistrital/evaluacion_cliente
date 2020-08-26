import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from '../@core/_guards/auth.guard';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
      // {
      // path: 'subgrupo_1',
      // loadChildren: './subgrupo_1/subgrupo_1.module#Subgrupo1Module',
      // },
      // {
      // path: 'subgrupo_2',
      // loadChildren: './subgrupo_2/subgrupo_2.module#Subgrupo2Module',
      // },
    {
      path: 'reportes',
      loadChildren: './reportes/reportes.module#ReportesModule',
    },
    {
      path: 'evaluar_proveedor',
      loadChildren: './evaluar-proveedor/evaluar-proveedor.module#EvaluarProveedorModule',
    },
    {
      path: 'evaluacion',
      loadChildren: './evaluacion/evaluacion.module#EvaluacionModule',
      canActivate: [AuthGuard],
    },
    {
      path: 'consulta_evaluacion/:TipoDocumento/:IdentificacionProveedor',
      loadChildren: './consulta-evaluacion/consulta-evaluacion.module#ConsultaEvaluacionModule',
    },
    {
      path: 'administracion_plantillas',
      loadChildren: './administracion-plantillas/administracion-plantillas.module#AdministracionPlantillasModule',
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
