export class InformacionDVE {
  activo: string;
  nombre_docente: string;
  numero_documento: string;
  nivel_academico: string;
  facultad: string;
  proyecto_curricular: string;
  ultimo_pago_dve:string;
  categoria:string

  constructor(
    activo: string,
    nombre_docente: string,
    numero_documento: string,
    nivel_academico: string,
    facultad: string,
    proyecto_curricular: string,
    ultimo_pago_dve:string,
    categoria:string
  ) {
    this.activo = activo;
    this.nombre_docente = nombre_docente;
    this.numero_documento = numero_documento;
    this.nivel_academico = nivel_academico;
    this.facultad = facultad;
    this.proyecto_curricular = proyecto_curricular;
    this.ultimo_pago_dve=ultimo_pago_dve
    this.categoria=categoria
  }
}
