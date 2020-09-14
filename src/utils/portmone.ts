import {NativeModules, Platform} from 'react-native';
import {Locale} from '../context/FormattingContext';
import {Theme} from '../context/ThemeContext';
import config from '../config';
const {PortmoneCardModule} = NativeModules;

//invokePortmoneSdk(String lang, String type, String theme)
//initCardPayment(String payeeId, String billNumber, Boolean preAuth, String phoneNumber, int billAmount
//tokenCardPayment(String payeeId, String billNumber, Boolean preAuth, String cardMask, String token, int billAmount, String desc
//initCardSaving(String payeeId, String billNumber, String desc

interface IInvokePortmoneSdk {
  lang: Locale;
  type: string;
  theme: Theme;
}

interface IInitCardPayment {
  billNumber: string;
  preAuth: boolean;
  phoneNumber: string;
  billAmount: number;
}

interface ITokenCardPayment {
  billNumber: string;
  preAuth: boolean;
  cardMask: string;
  token: string;
  billAmount: number;
  desc: string;
}

interface IInitCardSaving {
  billNumber: string;
  desc: string;
}

export default {
  invokePortmoneSdk: async (options: IInvokePortmoneSdk) => {
    if (Platform.OS === 'android') {
      return PortmoneCardModule.invokePortmoneSdk(
        options.lang,
        'phone',
        options.theme,
      );
    } else {
      return PortmoneCardModule.invokePortmoneSdk(
        options.lang,
        'phone',
        options.theme,
      );
    }
  },
  initCardPayment: async (options: IInitCardPayment) => {
    if (Platform.OS === 'android') {
      return PortmoneCardModule.initCardPayment(
        config.payeeId,
        options.billNumber,
        options.preAuth,
        options.phoneNumber,
        options.billAmount,
      );
    } else {
      return PortmoneCardModule.initCardPayment(
        config.payeeId,
        options.billNumber,
        options.preAuth,
        options.phoneNumber,
        options.billAmount,
      );
    }
  },
  tokenCardPayment: async (options: ITokenCardPayment) => {
    if (Platform.OS === 'android') {
      return PortmoneCardModule.tokenCardPayment(
        config.payeeId,
        options.billNumber,
        options.preAuth,
        options.cardMask,
        options.token,
        options.billAmount,
        options.desc,
      );
    } else {
      return PortmoneCardModule.tokenCardPayment(
        config.payeeId,
        options.billNumber,
        options.preAuth,
        options.cardMask,
        options.token,
        options.billAmount,
        options.desc,
      );
    }
  },
  initCardSaving: async (options: IInitCardSaving) => {
    if (Platform.OS === 'android') {
      return PortmoneCardModule.initCardSaving(
        config.payeeId,
        options.billNumber,
        options.desc,
      );
    } else {
      return PortmoneCardModule.initCardSaving(
        config.payeeId,
        options.billNumber,
        options.desc,
      );
    }
  },
};
