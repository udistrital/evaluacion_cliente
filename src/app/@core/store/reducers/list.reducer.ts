import { REDUCER_LIST } from '../reducer.constants';

export class ListReducer {
  constructor() {
  }

  static ListReducerPlantilla(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Plantilla:
        return [...state, action.payload];
      default:
        return state;
    }
  }

}
