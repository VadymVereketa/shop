import {IRootCategory, ITag} from '../../typings/FetchData';
import {IFetchCategory, ITreeCategory} from '../../typings/ICategory';

export interface ICategoryState {
  data: IRootCategory[];
  tags: ITag[];
  isLoading: boolean;
  error: any;
  rootsCategory: IFetchCategory[];
  treeCategories: ITreeCategory;
}
