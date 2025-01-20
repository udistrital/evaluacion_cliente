import { Injectable } from "@angular/core";
import { RequestManager } from "../../managers/requestManager";

@Injectable({
    providedIn: "root",
  })
  export class DocumentosCrudService {

constructor(private requestManager:RequestManager){

}

get(endpoint: string) {

    this.requestManager.setPath('DOCUMENTOS_CRUD');
    return this.requestManager.get(endpoint);
  }



  }
