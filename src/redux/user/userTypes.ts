import {IBaseActions, IBaseState} from '../base/baseTypes';
import {IAddress, ICard, IContact, IUser} from '../../typings/FetchData';

export interface IUserState extends IBaseState {
  data: IUser | null;
  token: string | null;
  isAuth: boolean;
}

export interface IUserActions extends IBaseActions {
  logout: () => any;
  updateUser: (d: IUser) => any;
  addAddress: (d: IAddress) => any;
  updateAddress: (d: IAddress) => any;
  deleteAddress: (id: number) => any;
  addContact: (d: IContact) => any;
  updateContact: (d: IContact) => any;
  deleteContact: (id: number) => any;
  deleteCard: (id: number) => any;
  setCards: (cards: ICard[]) => any;
  setAuth: (b: boolean) => any;
  setToken: (token: string | null) => void;
}
