import { TipoDocumento } from './tipo_documento';

export class Documento {
    Descripcion: string;
    Enlace: string;
    Id: number;
    Activo: boolean;
    Metadatos: string;
    Nombre: string;
    TipoDocumento: TipoDocumento;
}
