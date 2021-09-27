import {IBaseActions, IBaseState} from '../base/baseTypes';
import {ICartItem} from '../../typings/FetchData';

export interface ICartState extends IBaseState {
  data: ICartItem[];
  isOpenCart: boolean;
  idSellPoint: number;
}

export interface IIncrement {
  id: string | number;
  count: number | null;
}
export interface IComment {
  id: string | number;
  comment: string;
  services: number[];
}

export interface ICartActions extends IBaseActions {
  addProduct: (item: ICartItem) => any;
  removeProduct: (id: string | number) => any;
  incrProduct: (obj: IIncrement) => any;
  decrProduct: (obj: IIncrement) => any;
  changeCount: (obj: IIncrement) => any;
  changeAlternativeCount: (obj: IIncrement) => any;
  setComment: (obj: IComment) => any;
  toggleCart: (obj: boolean) => any;
  updateCart: (obj: number) => any;
  clear: (id: number) => any;
}
