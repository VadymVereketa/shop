import {
  IAddressRedux,
  IContact,
  IDeliveryType,
  IPaymentType,
  ISellPoint,
} from '../../typings/FetchData';

export interface IOrderState {
  deliveryType: IDeliveryType | null;
  paymentType: IPaymentType | null;
  step: number;
  contact: IContact | null;
  sellPoint: number | null;
  isCallBack: boolean;
  date: Date | null;
  time: string;
  anonymousMessage: string | null;
  addressId: number | null;
  commentAddress: string;
  address: string;
  numberOrder: number | null;
  idDeliveryPrice: number;
  statusPayment: StatusPayment;
  isRepeatOrder: boolean;
  cardId: number;
  expressSellPoint: ISellPoint | null;
}

export enum StatusPayment {
  defult,
  online,
  payment,
  error,
}
export interface IOrderActions {
  setData: (o: Partial<IOrderState>) => any;
  addContact: (data: IReceiver) => any;
  removeContact: () => any;
  updateContact: (data: IReceiver) => any;
  addPaymentCard: (data: Omit<IPaymentCard, 'id'>) => any;
  addPaymentCards: (data: IPaymentCard[]) => any;
  checkLast: () => any;
  clear: () => any;
}

export interface IReceiver {
  id: number | null;
  name: string;
  phone: string;
  isPhoneCustom: boolean;
}
export interface IPaymentCard {
  id: number;
  number: string;
  month: string;
  year: string;
  cvv: string;
}
