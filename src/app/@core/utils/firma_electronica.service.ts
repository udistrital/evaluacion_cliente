import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RequestManager } from '../../managers/requestManager';
import { DocumentoService } from '../data/documento.service';
import { Documento } from '../data/models/documento';

@Injectable({
    providedIn: 'root',
})
export class FirmaElectronicaService {

    constructor(
        private anyService: RequestManager,
        private documentoService: DocumentoService,
        private sanitization: DomSanitizer,
    ) { }
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
                if ((encoded.length % 4) > 0) {
                    encoded += '='.repeat(4 - (encoded.length % 4));
                }
                resolve(encoded);
            };
            reader.onerror = error => reject(error);
        });
    }
    uploadFilesElectronicSign(files) {
        const documentsSubject = new Subject<Documento[]>();
        const documents$ = documentsSubject.asObservable();
        const documentos = [];
        files.map(async (file) => {
            const sendFileDataandSigners = [{
                IdTipoDocumento: file.IdDocumento,
                nombre: file.nombre,
                metadatos: file.metadatos ? file.metadatos : {},
                descripcion: file.descripcion ? file.descripcion : '',
                file: await this.fileToBase64(file.file),
                firmantes: file.firmantes ? file.firmantes : [],
                representantes: file.representantes ? file.representantes : [],
            }];
            this.anyService.setPath('FIRMA_ELECTRONICA_MID');
            this.anyService.post('firma_electronica', sendFileDataandSigners)
                .subscribe((dataResponse) => {
                    documentos.push(dataResponse);
                    if (documentos.length === files.length) {
                        documentsSubject.next(documentos);
                    }
                }, (error) => {
                    documentsSubject.error(error);
                });
        });
        return documents$;
    }
}