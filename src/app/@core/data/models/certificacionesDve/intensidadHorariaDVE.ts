export class IntensidadHorariaDVE {
  constructor(
    anio: string,
    periodo: string,
    nombreAsignatura: string,
    horasSemana: string,
    numeroSemanas: string,
    horasSemestrales: string,
    salarioDocente: string
  ) {
    this.anio = anio;
    this.periodo = periodo;
    this.nombreAsignatura = nombreAsignatura;
    this.horasSemana = horasSemana;
    this.numeroSemanas = numeroSemanas;
    this.horasSemestrales = horasSemestrales;
    this.salarioDocente = salarioDocente;
  }

  anio: string;
  periodo: string;
  nombreAsignatura: string;
  horasSemana: string;
  numeroSemanas: string;
  horasSemestrales: string;
  salarioDocente: string;
}
