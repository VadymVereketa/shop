import {useMemo} from 'react';
import {TypePayment} from '../constants/constantsId';
import t from '../utils/translate';

export const usePaymentOptions = () => {
  const options = useMemo(() => {
    return [
      {
        code: TypePayment.cash,
        title: t('cashPayment'),
      },
      {
        code: TypePayment.credit,
        title: t('cartPaymetnInGet'),
      },
      {
        code: TypePayment.online,
        title: t('onlinePayment'),
        icon: true,
      },
    ];
  }, []);
  return options;
};
