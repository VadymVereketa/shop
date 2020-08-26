import {IRootCategory, ITag} from '../../typings/FetchData';

export interface ICategoryState {
  data: IRootCategory[];
  tags: ITag[];
  isLoading: boolean;
  error: any;
}
