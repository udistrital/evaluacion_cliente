import { Resoluciones } from "./resoluciones";

export interface IntensidadHorariaDVE {

    anio: string,
    periodo: string,
    tipoVinculacion: string,
    numeroSemanas: string,
    horaSemanales: string,
    resoluciones: Resoluciones[],

}


