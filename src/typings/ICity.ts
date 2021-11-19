import {IDeliveryPrice} from './FetchData';

export interface ISetupCity {
  id: number;
  value: string | null;
  isActive: boolean;
  setting: IDefaultSetting;
}

export interface IDefaultSetting {
  code: ISettingCityCode;
  type: string;
  description: string;
  defaultValue: string;
  dictionaryName: string;
}

export interface ICityBase {
  id: number;
  externalId: string;
  name: string;
  isActive: boolean;
  deliveryPrices: IDeliveryPrice[];
}

export interface ICityFetch extends ICityBase {
  id: number;
  externalId: string;
  name: string;
  isActive: boolean;
  setups: ISetupCity[];
}

export interface ICityRedux extends ICityBase {
  id: number;
  externalId: string;
  name: string;
  isActive: boolean;
  setups: ISettingCity;
}

export type ISettingCity = {
  [name in ISettingCityCode]?: any;
};

export type ISettingCityCode =
  | 'default_delivery_sell_points' /** Точки продажу з яких проводиться кур'єрська доставка */
  | 'default_price_sell_point' /** Точка продажу за замовчуванням для відображення ціни продукту в замовленні */
  | 'default_delivery_price'; /** Доставка за замовчуванням" */
