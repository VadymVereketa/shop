import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {TypePayment} from '../constants/constantsId';
import {selectorsOther} from '../redux/other/otherReducer';
import t from '../utils/translate';

export const usePaymentOptions = () => {
  const draftId = useSelector(selectorsOther.getDraftId);

  const options = useMemo(() => {
    const res = [
      {
        code: TypePayment.cash,
        title: t('cashPayment'),
      },
      {
        code: TypePayment.credit,
        title: t('cartPaymetnInGet'),
      },
    ];
    if (draftId) {
      res.push({
        code: TypePayment.online,
        title: t('onlinePayment'),
        icon: true,
      } as any);
    }

    return res;
  }, [draftId]);

  return options;
};
