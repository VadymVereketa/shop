export const ID_UNIT_WEIGHT = 'кг' as const;
export const DEFAULT_NAME_SETTING = 'default';
export const FRACTION_DIGIT = 2;
export const COUNT_DAY = 7;

export enum TypeDelivery {
  self = 'self',
  courier = 'courier',
  express = 'express',
}

export enum TypePayment {
  cash = 'cash',
  credit = 'credit',
  online = 'online',
}
