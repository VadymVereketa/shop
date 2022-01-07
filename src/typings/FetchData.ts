import {TypeDelivery} from '../constants/constantsId';

export interface ICategory {
  id: number;
  externalId: string;
  name: string;
  description: string;
  isActive: true;
  categoryImages: {
    id: number;
    uuid: string;
  } | null;
  location: Location; //todo shop & restaurant
}

export enum Location {
  shop = 'shop',
  restaurant = 'restaurant',
}

export interface IProduct {
  id: number;
  externalId: string;
  title: string;
  shortDescription: string;
  fullDescription: string | null;
  garnish: string;
  minCount: string;
  coefficient: number;
  energyValue: string | null;
  ingredients: string;
  units: string;
  productOptions: IProductOption[];
  sellPoint: ISellPoint;
  category: ICategory;
  unit: IUnit;
  productImages: IImgProduct[];
  weight: string | null; //todo don't get from backend
  avgWeight: string | null;
  customCategory: ICustomCategory;
  services: IServiceProduct[];
  timeToPrepare: number;
}

export interface IServiceProduct {
  id: number;
  isActive: boolean;
  name: string;
  ord: number | null;
}

export interface ICustomCategory {
  id: number;
  name: string;
  description: string;
  ord: number;
}

export interface IRootCategory extends ICustomCategory {
  children: IChildCategory[];
}
export interface IChildCategory extends ICustomCategory {
  parentId: number | null;
  img: string | null;
}

export interface IImgProduct {
  uuid: string;
}

export interface IProductOption {
  id: number;
  available: boolean;
  price: string;
  sellPoint: ISellPoint;
}

export interface ISellPoint {
  id: number;
  externalId: string;
  address: string | null;
  name: string;
  street: string | null;
  district: string | null;
  buildNumber: string | null;
  corps: string | null;
  phone: string | null;
  workTime: string | null;
  description: string;
  isActive: boolean;
  img: string | null;
  sellPointImage: IImgProduct | null;
  workingHours1?: string;
  workingHours2?: string;
  workingHoursNotes?: string;
}

export interface IUnit {
  id: number;
  externalId: string;
  type: string;
}

export interface ILogin {
  token: string;
  user: IUser;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string | null;
  phone: string;
  isPhoneCustom: boolean;
  email: string;
  loyaltyCard: string | null;
  contacts: IContact[];
  certificates: any[];
  creditCards: ICard[];
  addresses: IAddress[];
}

export interface ICard {
  id: number;
  token: string;
  number: string;
  description: string;
}
export interface ISignUp {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  password?: string;
  confirmedPassword?: string;
  isPhoneCustom: boolean;
}

export interface IContact {
  id: number;
  firstName: string;
  lastName: string | null;
  phone: string;
  isPhoneCustom: boolean;
}

export interface IAddress {
  id: number;
  street: string;
  district: string | null;
  buildNumber: string;
  entrance: string | null;
  flatNumber: string | null;
  floor: string | null;
  corps: string | null;
  notes: string | null;
  addressDictionary: {
    id: number | null;
    district: {
      deliveryPrice: {
        id: number;
      };
    };
  } | null;
}

export interface IAddressRedux {
  id?: number;
  street: string;
  district: string;
  buildNumber: string;
  entrance: string | null;
  flatNumber: string | null;
  floor: string | null;
  city: number;
  buildObj:
    | {
        extra: {idDistrict: number; name: string};
        label: string;
        value: number;
      }
    | any
    | null;
  streetObj: {
    label: string;
    value: number;
  } | null;
}

export interface IAddressDictionary {
  buildNumber: string;
  district: {
    deliveryPrice: IDeliveryPrice;
    id: number;
    name: string;
  };
  id: number;
  street: {id: number; name: string};
}

export interface IDeliveryType {
  id: number;
  code: TypeDelivery;
  type: string;
}

export interface IPaymentType {
  id: number;
  code: string;
  type: string;
}

///cart
export interface ICartItem {
  count: number;
  price?: string;
  comment: string;
  alternativeCount: number | null;
  product: {
    id: number;
    externalId: string;
    title: string;
    shortDescription: string;
    fullDescription: null | string;
    garnish: string;
    minCount: string;
    coefficient: number;
    energyValue: string | null;
    ingredients: string;
    units: string;
    productImages: IImgProduct[];
    productOptions: IProductOption[];
    avgWeight: string | null;

    services: IServiceProduct[];
    timeToPrepare: number;
  };
  services: number[];
}

export interface ICart {
  id: number;
  total: string;
  cartProducts: ICartItem[];
  sellPoint: ISellPoint;
  deliveryType: IDeliveryType;
}

export interface IChangePassword {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IUpdateCart {
  id: number;
  total: number;
  sellPoint: {id: number};
  cartProducts: IUpdateCartItem[];
}

export interface IUpdateCartItem {
  count: string;
  product: {
    id: number;
  };
  comment: string;
  price: number;
}

export interface ISetup {
  id: number;
  value: string | null;
  isActive: boolean;
  sellPoint?: ISellPoint;
  setting: IDefaultSetting;
}

export interface IDefaultSetting {
  code: ISettingCode;
  type: string;
  description: string;
  defaultValue: string;
}

export type ISettingSellPoint = {
  [name in ISettingCode]?: string;
};

export type ISettingCode =
  | 'default_price_sell_point'
  | 'delivery_phone'
  | 'delivery_time_from'
  | 'delivery_time_to'
  | 'order_offset_time'
  | 'order_time_from'
  | 'order_time_step'
  | 'order_time_to'
  | 'order_time_range'
  | 'public_message'
  | 'min_different'
  | 'max_different'
  | 'default_delivery_price'
  | 'increase_percentage'
  | 'default_delivery_price_express'
  | 'preauth_payment';

export interface IPurchase {
  count: string;
  price: string;
  comment: string;
  isReady: boolean;
  isConfirmWeight: boolean;
  alternativeCount: null;
  product: IProduct;
}

export interface IOrderItem {
  id: number;
  orderAddress: string;
  productsPrice: string;
  createdDate: string;
  updatedDate: null;
  minExecuteDate: string;
  maxExecuteDate: string;
  comment: string;
  deletedDate: null;
  externalBarCode: null;
  timeToPrepare: null;
  isWeightConfirmed: boolean;
  orderStatus: IOrderStatus;
  purchases: IPurchase[];
}

export interface IOrderFull extends IOrderItem {
  address: IAddress | null;
  deliveryType: IDeliveryType;
  deliveryStatus: IOrderStatus;
  orderStatusHistories: IOrderStatusHistory[];
  payments: {
    id: number;
    paymentStatus: boolean;
    totalPrice: string;
    payDate: null;
    paymentType: IPaymentType;
  };
  client: IClient;
  contact: IClient | null;
  sellPoint: ISellPoint;
  deliveryPackage: {
    id: number;
    startDate: null;
    endDate: null;
    isAvailable: boolean;
    courier: ICourier | null;
  } | null;
  deliveryPrice: {
    id: number;
    price: string;
  } | null;
}

export interface ICourier {
  id: number;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface IOrderStatus {
  id: number;
  code: string;
  status: string;
  ord: number;
}

export interface IOrderStatusHistory {
  id: number;
  setDate: string;
  orderStatus: IOrderStatus;
}

export interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  isPhoneCustom: boolean;
  email: string;
}

export interface IOrder {
  items: IOrderItem[];
  count: number;
}

export interface IDeliveryPrice {
  id: number;
  price: string;
  description: string;
  externalId: string;
  isActive: boolean;
}

export interface ITag {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  ord: number;
}

export interface IDraft {
  id?: number | null;
  phone: string;
  firstName: string;
  lastName: string;
  purchases: {
    product: {
      id: number;
    };
    price: number;
    comment: string | null;
    count: number;
    alternativeCount: number | null;
  }[];
  productsPrice: number;
  sellPoint: {
    id: number;
    name: string;
  };
  deliveryPrice?: {
    id: number;
  };
  deliveryType?: {
    id: number;
  };
  paymentType?: {
    id: number;
  };
  orderAddress: string;
  comment: string | null;
}
