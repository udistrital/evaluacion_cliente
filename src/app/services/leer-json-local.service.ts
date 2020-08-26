import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root',
})

export class LeerJsonLocalService {
  urlJson: any;

  constructor(private http: HttpClient) {
    this.urlJson = '../../assets/data/plantilla.json';
   }

   get(endpoint: string) {
     return this.http.get(this.urlJson);
   }
}


