import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PagesComponent } from "./pages.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { AuthGuard } from "../@core/_guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "evaluar_proveedor",
        loadChildren:
          "./evaluar-proveedor/evaluar-proveedor.module#EvaluarProveedorModule",
        canActivate: [AuthGuard],
      },
      {
        path: "evaluacion",
        loadChildren: "./evaluacion/evaluacion.module#EvaluacionModule",
        canActivate: [AuthGuard],
      },
      {
        path: "consulta_evaluacion/:TipoDocumento/:IdentificacionProveedor",
        loadChildren:
          "./consulta-evaluacion/consulta-evaluacion.module#ConsultaEvaluacionModule",
        canActivate: [AuthGuard],
      },
      {
        path: "administracion_plantillas",
        loadChildren:
          "./administracion-plantillas/administracion-plantillas.module#AdministracionPlantillasModule",
        canActivate: [AuthGuard],
      },
      {
        path: "certificaciones",
        loadChildren:
          "./certificaciones/certificaciones.module#CertificacionesModule",
        canActivate: [AuthGuard],
      },
      {
        path: "certificacionesdve",
        loadChildren:
          "./certificaciones-dve/certificaciones-dve.module#CertificacionesDveModule",
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
