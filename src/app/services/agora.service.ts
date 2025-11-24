import { Injectable } from "@angular/core";
import { RequestManager } from "../managers/requestManager";

@Injectable({
    providedIn: 'root',
  })
  

  export class AgoraService{

    constructor(private requestManager:RequestManager){

    }

    get(endpoint: string) {

        this.requestManager.setPath('AGORA_SERVICE');
        return this.requestManager.get(endpoint);
      }

  }
