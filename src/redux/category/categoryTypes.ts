import {IRootCategory} from '../../typings/FetchData';

export interface ICategoryState {
  data: IRootCategory[];
  isLoading: boolean;
  error: any;
}
