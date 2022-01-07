import {ICityRedux} from '../../typings/ICity';
import {IBaseActions, IBaseState} from '../base/baseTypes';

export interface ICityActions extends IBaseActions {
  setDataItem: (o: Partial<ICityState>) => any;
}

export interface ICityState extends IBaseState<ICityRedux[]> {
  selectedCity: number | null;
}

export type ItemCityState = keyof ICityState;
