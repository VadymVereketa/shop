import {ISellPoint} from '../../typings/FetchData';

export interface ISellPointsState {
  data: ISellPoint[];
  isLoading: boolean;
  error: any;
}
