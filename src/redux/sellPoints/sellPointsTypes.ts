import {ISellPoint} from '../../typings/FetchData';
import {IBaseActions} from '../base/baseTypes';

export interface ISellPointsActions extends IBaseActions {
  setOptionData: (data: Partial<ISellPointsState>) => any;
}

export interface ISellPointsState {
  data: ISellPoint[];
  isLoading: boolean;
  error: any;
  expressSellPoints: ISellPoint[];
}
