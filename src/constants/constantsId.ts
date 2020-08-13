export const ID_UNIT_WEIGHT = 'кг' as const;
export const DEFAULT_NAME_SETTING = 'default';
export const FRACTION_DIGIT = 2;

export enum TypeDelivery {
  self = 'self',
  courier = 'courier',
}

export enum TypePayment {
  cash = 'cash',
  credit = 'credit',
  online = 'online',
}
