import {
  IDeliveryPrice,
  IDeliveryType,
  IPaymentType,
} from '../../typings/FetchData';

export interface ITypeState {
  deliveryTypes: IDeliveryType[];
  paymentTypes: IPaymentType[];
  pricesTypes: IDeliveryPrice[];
  isLoading: boolean;
  error: any;
}
