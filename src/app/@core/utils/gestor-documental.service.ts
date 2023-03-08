import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RequestManager } from '../../managers/requestManager';
import { DocumentoService } from '../data/documento.service';
import { Documento } from '../data/models/documento';

@Injectable({
  providedIn: 'root'
})
export class GestorDocumentalService {

  constructor(
    private anyService: RequestManager,
    private documentoService: DocumentoService,
    private sanitization: DomSanitizer
  ) { }

  getUrlFile(base64, minetype) {
    return new Promise<string>((resolve, reject) => {
      const url = `data:${minetype};base64,${base64}`;
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "File name", { type: minetype })
          const url = URL.createObjectURL(file);
          resolve(url);
        })
    });
  }

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

  uploadFiles(files) {
    const documentsSubject = new Subject<Documento[]>();
    const documents$ = documentsSubject.asObservable();
    const documentos = [];
    files.map(async (file) => {
      const sendFileData = [{
        IdTipoDocumento: file.IdDocumento,
        nombre: file.nombre,
        metadatos: file.metadatos ? file.metadatos : {},
        descripcion: file.descripcion ? file.descripcion : "",
        file: await this.fileToBase64(file.file)
      }]
      this.anyService.setPath('GESTOR_DOCUMENTAL_MID');
      this.anyService.post('document/upload',sendFileData)
        .subscribe((dataResponse) => {
          documentos.push(dataResponse);
          if (documentos.length === files.length) {
            documentsSubject.next(documentos);
          }
        }, (error) => {
          documentsSubject.error(error);
        })
    });
    return documents$;
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
        descripcion: file.descripcion ? file.descripcion : "",
        file: await this.fileToBase64(file.file),
        firmantes: file.firmantes ? file.firmantes : [],
        representantes: file.representantes ? file.representantes : []
      }]
      this.anyService.setPath('GESTOR_DOCUMENTAL_MID');
      this.anyService.post('document/firma_electronica',sendFileDataandSigners)
        .subscribe((dataResponse) => {
          documentos.push(dataResponse);
          if (documentos.length === files.length) {
            documentsSubject.next(documentos);
          }
        }, (error) => {
          documentsSubject.error(error);
        })
    });
    return documents$
  }

  getFiles(files) {
    const documentsSubject = new Subject<Documento[]>();
    const documents$ = documentsSubject.asObservable();
    const documentos = files;
    let i = 0;
    files.map((file, index) => {
      this.documentoService.get('documento/'+file.id)
        .subscribe((doc: Documento) => {
          this.anyService.setPath('GESTOR_DOCUMENTAL_MID');
          this.anyService.get('document/'+doc.Enlace)
            .subscribe(async (f: any) => {
              const url = await this.getUrlFile(f.file, f['file:content']['mime-type']);
              documentos[index] = { ...documentos[index], ...{ url: url}, ...{ Documento: this.sanitization.bypassSecurityTrustUrl(url) } }
              i += 1;
              if (i === files.length) {
                documentsSubject.next(documentos);
              }
            }, (error) => {
              documentsSubject.error(error);
            })
        }, (error) => {
          documentsSubject.error(error);
        })
    });
    return documents$
  }

  getByUUID(uuid) {
    const documentsSubject = new Subject<Documento[]>();
    const documents$ = documentsSubject.asObservable();
    let documento = null;
    this.anyService.setPath('GESTOR_DOCUMENTAL_MID');
    this.anyService.get('document/'+uuid)
      .subscribe(async (f: any) => {
        const url = await this.getUrlFile(f.file, f['file:content']['mime-type']);
        documento = url
        documentsSubject.next(documento);
      }, (error) => {
        documentsSubject.error(error);
      })
    return documents$;
  }

}
