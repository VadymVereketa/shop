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
        title: 'Оплатити карткою при отриманні',
      },
      {
        code: TypePayment.online,
        title: 'Оплата карткою в додатку',
        icon: true,
      },
    ];
  }, []);
  return options;
};
