import {
  IDeliveryPrice,
  IDeliveryType,
  IPaymentType,
} from '../../typings/FetchData';

export interface ITypeState {
  deliveryTypes: IDeliveryType[];
  paymentTypes: IPaymentType[];
  isLoading: boolean;
  error: any;
}
