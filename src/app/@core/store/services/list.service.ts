import { Injectable } from '@angular/core';
import { IAppState } from '../app.state';
import { Store } from '@ngrx/store';
import { REDUCER_LIST } from '../reducer.constants';
import { EvaluacionmidService } from '../../data/evaluacionmid.service';

@Injectable()
export class ListService {

  constructor(
    private evaluacionmidService: EvaluacionmidService,
    private store: Store<IAppState>) {
  }

  public findPlantilla() {

    this.store.select(REDUCER_LIST.Plantilla).subscribe(
      (list: any) => {
        console.info('REDUCER');
        if (!list || list.length === 0) {
          console.info('se busca platilla');
          this.evaluacionmidService.get('plantilla')
            .subscribe(
              (res: any[]) => {
                console.info('PLATILLA ENCONTRADA');

                this.addList(REDUCER_LIST.Plantilla, res);
              },
              error => {
                this.addList(REDUCER_LIST.Plantilla, []);
              },
            );
        }
      },
    );
  }

  private addList(type: string, object: Array<any>) {
    this.store.dispatch({
      type: type,
      payload: object,
    });
  }
}
