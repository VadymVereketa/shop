import config from '../config/config';
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
  enlargePrice: boolean = false,
) => {
  const billAmount = enlargePrice ? totalPrice + totalPrice * 0.15 : totalPrice;

  return {
    paymentTypes: {
      card: 'Y',
      portmone: 'Y',
      gpay: 'Y',
      applepay: 'Y',
      token: 'N',
      masterpass: 'Y',
      visacheckout: 'Y',
      createtokenonly: 'N',
      privat: 'Y',
      installment: 'Y',
    },
    priorityPaymentTypes: {
      card: '1',
      portmone: '2',
      masterpass: '3',
      visacheckout: '4',
      gpay: '5',
      applepay: '6',
      privat: '7',
      installment: '8',
    },
    payee: {
      payeeId: config.payeeId,
    },
    order: {
      shopOrderNumber: numberOrder,
      billAmount: billAmount,
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
  enlargePrice: boolean;
};
export const getDataPortmonePaymentByToken = ({
  number,
  description,
  numberOrder,
  token,
  totalPrice,
  connectKey,
  enlargePrice,
}: options) => {
  const billAmount = enlargePrice ? totalPrice + totalPrice * 0.15 : totalPrice;

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
      billAmount: billAmount,
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
