import config from '../config';
import {v4 as uuidv4} from 'uuid';

export const getDataPortmoneSaveCard = (connectKey: string) => {
  return {
    paymentTypes: {
      createtokenonly: 'Y',
    },
    priorityPaymentTypes: {
      createtokenonly: '1',
    },
    payee: {
      payeeId: config.payeeId,
    },
    order: {
      description: uuidv4(),
      attribute1: 'token',
      attribute2: connectKey,
      successUrl: `${config.canLink}/result-payment`,
      billAmount: '1',
    },
    token: {
      tokenFlag: 'Y',
      returnToken: 'Y',
      otherPaymentMethods: 'N',
    },
    payer: {
      lang: 'uk',
    },
    style: {
      type: 'light',
      backgroundColorButtons: '#01A6E6',
      colorTextAndIcons: '#01A6E6',
      bcMain: '#fff',
    },
  };
};
export const getDataPortmonePaymentByCard = (
  numberOrder: number,
  totalPrice: number,
  connectKey: string,
) => {
  return {
    paymentTypes: {
      card: 'Y',
      portmone: 'Y',
      gpay: 'Y',
      token: 'N',
      masterpass: 'Y',
      visacheckout: 'Y',
      createtokenonly: 'N',
    },
    priorityPaymentTypes: {
      card: '1',
      portmone: '2',
      qr: '0',
      masterpass: '3',
      token: '0',
      visacheckout: '4',
      createtokenonly: '5',
      gpay: '6',
    },
    payee: {
      payeeId: config.payeeId,
    },
    order: {
      description: 'test',
      shopOrderNumber: numberOrder,
      billAmount: totalPrice,
      attribute1: 'payment',
      attribute2: connectKey,
      successUrl: `${config.canLink}/result-payment`,
      preauthFlag: 'Y',
      billCurrency: 'UAH',
      expTime: '1000',
    },
    payer: {
      lang: 'uk',
      emailAddress: '',
      showEmail: 'N',
    },
    style: {
      type: 'light',
      backgroundColorButtons: '#01A6E6',
      colorTextAndIcons: '#01A6E6',
      bcMain: '#fff',
    },
  };
};
type options = {
  numberOrder: number;
  totalPrice: number;
  token: string;
  number: string;
  description: string;
  connectKey: string;
};
export const getDataPortmonePaymentByToken = ({
  number,
  description,
  numberOrder,
  token,
  totalPrice,
  connectKey,
}: options) => {
  return {
    paymentTypes: {
      token: 'Y',
    },
    priorityPaymentTypes: {
      token: '1',
    },
    payee: {
      payeeId: config.payeeId,
    },
    order: {
      description: description,
      shopOrderNumber: numberOrder,
      billAmount: totalPrice,
      attribute1: 'payment',
      attribute2: connectKey,
      successUrl: `${config.canLink}/result-payment`,
      preauthFlag: 'Y',
      billCurrency: 'UAH',
      expTime: '1000',
    },
    token: {
      tokenFlag: 'Y',
      returnToken: 'Y',
      token: token,
      cardMask: number,
      otherPaymentMethods: 'N',
    },
    payer: {
      lang: 'uk',
      emailAddress: '',
      showEmail: 'N',
    },
    style: {
      type: 'light',
      backgroundColorButtons: '#01A6E6',
      colorTextAndIcons: '#01A6E6',
      bcMain: '#fff',
    },
  };
};
