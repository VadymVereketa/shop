import TypeSortProduct from './TypeSortProduct';

export interface IQueryOptions {
  top?: number;
  skip?: number;
}

export interface IGetProducts extends IQueryOptions {
  idCategory?: number | null | undefined;
  idTag?: number | null | undefined;
  title?: string;
  idSellPoint?: number;
  sort?: TypeSortProduct | null;
}

export interface IOrderPost {
  phone: string;
  firstName: string;
  lastName: string;
  deliveryType: {
    id: number;
  };
  sellPoint: {
    id: number;
  };
  payments: {
    paymentType: {
      id: number;
    };
  };
  minExecuteDate: Date;
  maxExecuteDate: Date;
  orderAddress: string;
  deliveryStatus: {
    id: number;
  };
  comment: string;
  timeToPrepare: null;
}
