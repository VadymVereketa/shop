import {useMemo} from 'react';
import {TypePayment} from '../constants/constantsId';

export const usePaymentOptions = () => {
  const options = useMemo(() => {
    return [
      {
        code: TypePayment.cash,
        title: 'Готівковий розрахунок',
      },
      {
        code: TypePayment.credit,
        title: 'Оплатити при отриманнi',
      },
      {
        code: TypePayment.online,
        title: 'Visa/MasterCard',
      },
    ];
  }, []);
  return options;
};
