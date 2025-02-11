import { IntensidadHorariaDVE } from "./intensidadHorariaDVE";

export interface InformacionDVE {
  activo: string;
  nombreDocente: string;
  numeroDocumento: string;
  nivelAcademico: string;
  facultad: string;
  proyectoCurricular: string;
  categoria: string;
  dedicacion: string;
  ultimoPagoDve: number;
  intensidadHoraria: IntensidadHorariaDVE[];
}