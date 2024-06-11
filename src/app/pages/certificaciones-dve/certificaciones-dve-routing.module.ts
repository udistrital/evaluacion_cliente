import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CertificacionesDveComponent } from "./certificaciones-dve.component";


const routes: Routes = [
  {
    path: "",
    component: CertificacionesDveComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificacionesDveRoutingModule {}
