import {TypeDelivery} from '../constants/constantsId';
import {IDeliveryType, ISellPoint} from '../typings/FetchData';
import t from '../utils/translate';

const useGetTranslateForDeliveryType = () => {
  return (deliveryType: IDeliveryType | null, sellPoint?: ISellPoint) => {
    if (!deliveryType) {
      return '';
    }
    switch (deliveryType.code) {
      case TypeDelivery.courier:
        return t('assortmentBtnText');
      case TypeDelivery.express:
        return 'Експрес-Доставки';
      case TypeDelivery.self:
        return sellPoint ? `${sellPoint.name}` : '';

      default:
        return '';
    }
  };
};

export default useGetTranslateForDeliveryType;
