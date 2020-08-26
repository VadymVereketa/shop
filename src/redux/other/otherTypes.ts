import {Locale} from '../../context/FormattingContext';
import {IDeliveryPrice, ISettingSellPoint} from '../../typings/FetchData';

export interface IOtherActions {
  addSearchQueries: (o: string) => any;
  removeSearchQueries: (o: string) => any;
  setLocale: (o: Locale) => any;
  setSettings: (o: Settings) => any;
  setSystemError: (b: boolean) => any;
  setDeliveryPrices: (data: IDeliveryPrice[]) => any;
  setData: (o: Partial<IOtherState>) => any;
}

export interface IOtherState {
  searchQueries: string[];
  locale: Locale | null;
  settings: Settings | null;
  isSystemError: boolean;
  isPaymentError: boolean;
  deliveryPrices: IDeliveryPrice[];
  maskCard: string;
  content: string[];
  connectKey: string;
  draftId: number | null;
  isGlobalSearch: string;
  theme: 'light' | 'dark';
}

export interface Settings {
  [name: string]: ISettingSellPoint;
}
