export class IntensidadHorariaDVE {
  constructor(
    anio: string,
    periodo: string,
    nombreAsignatura:string[],
    horasSemana: string,
    numeroSemanas: string,
    horasSemestrales: string,
    FechaInicio:Date,
    FechaFin:Date

  ) {
    this.anio = anio;
    this.periodo = periodo;
    this.nombreAsignatura = nombreAsignatura;
    this.horasSemana = horasSemana;
    this.numeroSemanas = numeroSemanas;
    this.horasSemestrales = horasSemestrales;
    this.FechaFin=FechaFin
    this.FechaInicio=FechaInicio
  }

  anio: string;
  periodo: string;
  nombreAsignatura: string[];
  horasSemana: string;
  numeroSemanas: string;
  horasSemestrales: string;

  FechaInicio:Date;
  FechaFin:Date;
}
