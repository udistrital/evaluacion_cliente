export class PeticionCertificacionesDve {
    NumeroDocumento: string;
    PeriodoInicial: string;
    PeriodoFinal: string;
    Vinculaciones: string;

    constructor(NumeroDocumento: string, PeriodoInicial: string, PeriodoFinal: string, Vinculaciones: string) {
        this.NumeroDocumento = NumeroDocumento;
        this.PeriodoInicial = PeriodoInicial;
        this.PeriodoFinal = PeriodoFinal;
        this.Vinculaciones = Vinculaciones;
    }
}