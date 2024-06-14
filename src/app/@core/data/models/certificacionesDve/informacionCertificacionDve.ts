import { InformacionDVE } from "./informacionDVE";
import { IntensidadHorariaDVE } from "./intensidadHorariaDVE";

export class InformacionCertificacionDve{

    informacionDve: InformacionDVE;
    intensidadHorariaDVE : IntensidadHorariaDVE[];

    constructor( informacionDve: InformacionDVE , intensidadHorariaDVE : IntensidadHorariaDVE[]){
        this.informacionDve = informacionDve;
        this.intensidadHorariaDVE = intensidadHorariaDVE;
    }


}