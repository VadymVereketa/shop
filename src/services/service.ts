import instance from './instance';
import {
  IAddress,
  ICart,
  ICartItem,
  ICategory,
  IChangePassword,
  IContact,
  ICustomCategory,
  IDefaultSetting,
  IOrderFull,
  ISetup,
  ISignUp,
  IUpdateCart,
  IUser,
  Location,
  IDeliveryPrice,
  ICard,
  IDeliveryType,
  IPaymentType,
  IProduct,
  IDraft,
} from '../typings/FetchData';
import {IGetProducts, IOrderPost} from '../typings/ServiceTypes';
import queries from './queries';
import {IOrderState} from '../redux/order/orderTypes';
import config from '../config/config';
import {getWithoutCodePhone} from '../utils/normalizePhone';
import buildQuery from '../utils/buildQuery';
import {AxiosResponse} from 'axios';
import {FRACTION_DIGIT, TypeDelivery} from '../constants/constantsId';
import {formatAddress} from '../utils/formatAddress';
import {DateHelper} from '../utils/DataHelper';
import {IFetchCategory} from '../typings/ICategory';

const service = {
  getSellPoints: async () => {
    return await customFetch(() => instance.get(queries.getRestaurants().url!));
  },
  getExpressSellPoints: async () => {
    return await customFetch(() =>
      instance.get(queries.getExpressSellPoints().url!),
    );
  },
  getTags: async () => {
    return customFetch(() => instance.get(queries.getTags().url!));
  },

  getCustomCategories: async () => {
    const res = await customFetch(() => instance.get('custom_categories'));
    if (res.success) {
      return res.data as IFetchCategory[];
    }
    return [];
  },
  getCategories: async () => {
    try {
      const res = await instance.get('categories?$filter=isActive');

      const data: ICategory[] = res.data;

      data.forEach((d, i) => {
        if (i % 2 === 0) {
          d.location = Location.shop;
        } else {
          d.location = Location.restaurant;
        }
      });

      return {
        success: true,
        data,
      };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  },
  getRootCategories: async () => {
    try {
      const res = await instance.get(
        'custom_categories/root?$filter=isActive&$count=true&$top=2&$skip=0&$orderby=ord',
      );

      const data: ICustomCategory[] = res.data.items;

      return {
        success: true,
        data,
      };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  },
  getChildrenCategories: async (id: number) => {
    try {
      const res = await instance.get(
        `custom_categories/children/${id}?$filter=isActive&$orderby=ord`,
      );

      const data: ICustomCategory[] = res.data;

      return {
        success: true,
        data,
      };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  },
  getProducts: async (opt: IGetProducts) => {
    return await customFetch(() => instance.get(queries.getProducts(opt).url!));
  },
  getExpressProducts: async (id: any) => {
    return await customFetch(() =>
      instance.get(queries.getProductByExpress(id).url!),
    );
  },
  getProductsByIds: async (ids: number[]) => {
    const filter = {
      or: ids.map((id) => ({id: id})),
    };
    return await customFetch<IProduct[]>(() =>
      instance.get<IProduct[]>('/products' + buildQuery({filter})),
    );
  },
  getOrders: async (opt: {top: number; skip: number}) => {
    return await customFetch(() => instance.get(queries.getOrders(opt).url!));
  },
  login: async (phone: string, password: string) => {
    return await customFetch(() =>
      instance.post<IUser>('auth/login', {
        phone,
        password,
      }),
    );
  },
  signup: async (data: ISignUp) => {
    return await customFetch(() =>
      instance.post<IUser>('auth/register', data, {
        withCredentials: true,
      }),
    );
  },
  logout: async () => {
    try {
      await instance.post('auth/logout');
      return true;
    } catch (e) {
      return false;
    }
  },
  refreshUser: async (headers?: any) => {
    try {
      const res = await instance.get('clients/profile');
      return res.data;
    } catch (e) {
      return null;
    }
  },
  saveCart: async (
    products: ICartItem[],
    idSellPoint: number,
    idDelivery: number,
  ) => {
    const data = {
      cartProducts: products.map((p) => {
        return {
          count: +p.count.toFixed(FRACTION_DIGIT),
          product: {
            id: p.product.id,
          },
          comment: p.comment,
          services: p.services || [],
          alternativeCount: p.alternativeCount
            ? p.alternativeCount.toString()
            : null,
        };
      }),
      sellPoint: {
        id: idSellPoint,
      },
      deliveryType: {
        id: idDelivery,
      },
    };
    return await customFetch(() =>
      instance.put<IUpdateCart>('clients/cart', data, {
        withCredentials: true,
      }),
    );
  },
  deleteCart: async () => {
    return await customFetch(() => instance.delete('clients/cart'));
  },
  getCart: async () => {
    try {
      const res = await instance.get<ICart>('clients/cart', {
        withCredentials: true,
      });

      if (
        res.data !== null &&
        res.data.cartProducts &&
        res.data.cartProducts.length > 0
      ) {
        res.data.cartProducts = res.data.cartProducts.map((p) => {
          p.alternativeCount = p.alternativeCount ? +p.alternativeCount : null;
          p.count = +p.count;
          return p;
        });

        return {
          sellPoint: res.data.sellPoint,
          items: res.data.cartProducts,
          deliveryType: res.data.deliveryType,
        };
      }
      return {
        sellPoint: null,
        items: [],
        deliveryType: null,
      };
    } catch (e) {
      return {
        sellPoint: null,
        items: [],
        deliveryType: null,
      };
    }
  },
  createOrder: async (draftId: number | undefined, data: IOrderState) => {
    if (!data.date) {
      return {
        success: false,
        data: null,
      };
    }
    let contact: any = {};
    const addressData: any = {};
    if (data.contact) {
      contact = {
        contact: {
          id: data.contact.id!,
        },
      };
    }

    let time = data.time;

    if (data.deliveryType!.code !== TypeDelivery.self) {
      addressData.address = {
        id: data.addressId,
      };
    } else {
      time = `${time}-${time}`;
    }

    let maxExecuteDate: Date | undefined = undefined;
    let minExecuteDate: Date | undefined = maxExecuteDate;

    const [minTime, maxTime] = time.split('-');
    const [maxH, maxM] = maxTime.split(':').map(parseFloat);
    const [minH, minM] = minTime.split(':').map(parseFloat);

    maxExecuteDate = new Date(data.date);
    maxExecuteDate.setHours(maxH, maxM);

    minExecuteDate = new Date(data.date);
    minExecuteDate.setHours(minH, minM);

    const fetchData: IOrderPost = {
      id: draftId ? draftId : undefined,
      comment: '',
      deliveryStatus: {
        id: 1,
      },
      deliveryType: {
        id: data.deliveryType!.id,
      },
      deliveryPrice: {
        id: data.idDeliveryPrice,
      },
      payments: {
        paymentType: data.paymentType!.id,
      },
      paymentType: {
        id: data.paymentType!.id,
      },
      ...contact,
      ...addressData,
      timeToPrepare: null,
      sellPoint: {
        id: data.sellPoint!,
      },
      maxExecuteDate:
        data.deliveryType!.code === TypeDelivery.self
          ? minExecuteDate
          : maxExecuteDate,
      minExecuteDate,
    };

    try {
      const res = await instance.post('clients/order', fetchData);

      return {
        success: true,
        data: res.data,
      };
    } catch (e) {
      return {
        success: false,
        data: e,
      };
    }
  },
  changePassword: async (data: IChangePassword) => {
    return await customFetch(() => instance.put('auth/change_password', data));
  },
  updateProfile: async (data: any) => {
    return await customFetch(() => instance.put('clients/profile', data));
  },
  addAddress: async (data: Omit<IAddress, 'id'>) => {
    return await customFetch(() => instance.post('clients/addresses', data));
  },
  updateAddress: async (data: IAddress) => {
    const id = data.id;
    delete data.id;
    return await customFetch(() =>
      instance.put(`clients/addresses/${id}`, data),
    );
  },
  deleteAddress: async (id: number) => {
    return await customFetch(() => instance.delete(`clients/addresses/${id}`));
  },
  addContact: async (data: Omit<IContact, 'id'>) => {
    return await customFetch(() => instance.post('clients/contacts', data));
  },
  updateContact: async (data: IContact) => {
    const id = data.id;
    delete data.id;
    return await customFetch(() =>
      instance.put(`clients/contacts/${id}`, data),
    );
  },
  deleteContact: async (id: number) => {
    return await customFetch(() => instance.delete(`clients/contacts/${id}`));
  },
  getAllSetups: async () => {
    try {
      const res = await instance.get<ISetup[]>('setups', {
        params: {
          skip: 0,
          top: 50,
        },
      });
      return res.data;
    } catch (e) {
      return [];
    }
  },
  getSettings: async () => {
    const filter = {
      'platformType/code': 'website',
    };
    try {
      const res = await instance.get<IDefaultSetting[]>('setups/settings', {
        params: {
          skip: 0,
          top: 50,
        },
      });
      return res.data;
    } catch (e) {
      return [];
    }
  },
  getOrder: async (id: number) => {
    return await customFetch(() =>
      instance.get<IOrderFull>('clients/orders/' + id, {
        withCredentials: true,
      }),
    );
  },
  getStreets: async (str: string) => {
    const filter = {
      'tolower(name)': {contains: encodeURIComponent(str.toLowerCase())},
    };
    return await customFetch(() =>
      instance.get(
        `${config.baseURLV2}dictionary/streets${buildQuery({filter})}`,
      ),
    );
  },
  getAddressesByStrees: async (id: number) => {
    const filter = {
      'street/id': id,
    };
    return await customFetch(() =>
      instance.get(
        `${config.baseURLV2}dictionary/addresses${buildQuery({filter})}`,
      ),
    );
  },
  getDeliveryPrices: async () => {
    const filter = {
      isActive: true,
    };
    return await customFetch(() =>
      instance.get<IDeliveryPrice[]>('delivery_prices' + buildQuery({filter})),
    );
  },
  getDeliveryTypes: async () => {
    return await customFetch(() =>
      instance.get<IDeliveryType[]>(queries.getDeliveryTypes().url!),
    );
  },
  getPaymentsTypes: async () => {
    return await customFetch(() =>
      instance.get<IPaymentType[]>(queries.getPaymentTypes().url!),
    );
  },
  resetPassword: async (phone: string) => {
    return await customFetch(() =>
      instance.post('auth/confirmationRequest/' + phone),
    );
  },
  restorePassword: async ({phone, code}: {phone: string; code: string}) => {
    return await customFetch(() =>
      instance.post('auth/restorePassword', {
        phone,
        confirmCode: code,
      }),
    );
  },
  getCards: async () => {
    return await customFetch(() =>
      instance.get<ICard[]>('clients/creditCards', {
        withCredentials: true,
      }),
    );
  },
  createCard: async (data: any, headers?: any) => {
    return await customFetch(() =>
      instance.post('clients/creditCards', data, {
        withCredentials: true,
        headers,
      }),
    );
  },
  deleteCard: async (id: number) => {
    return await customFetch(() =>
      instance.delete('clients/creditCards/' + id, {
        withCredentials: true,
      }),
    );
  },
  preAuthPayment: async (data: any) => {
    return await customFetch(() =>
      instance.post(config.baseURLCallback + 'payments/pre_auth', data),
    );
  },
  createDraft: async (data?: IDraft) => {
    return await customFetch(() => instance.post('clients/order/draft', data));
  },
  getExcludeTime: async (d: Date) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    try {
      const res = await instance.get(
        'delivery/time/exclude/' + `${y}-${m}-${day}`,
      );
      return {
        success: true,
        data: res.data,
        date: d,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
  getExcludeTimeSellPoint: async (d: Date, id: any, isSelfDelivery = true) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    try {
      const res = await instance.get(
        `/delivery/time/exclude/${y}-${m}-${day}/${id}/${isSelfDelivery}`,
      );

      return {
        success: true,
        data: res.data,
        date: d,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
  getCurrentTime: async () => {
    const res = await customFetch(() => instance.get('clients/order/date'));
    if (res.success) {
      const d = new Date(res.data.date);
      return d;
    }
    return new Date();
  },
};

const customFetch = async <T>(func: () => Promise<AxiosResponse<T>>) => {
  try {
    const res = await func();
    return {
      success: true,
      data: res.data as T,
      code: res.status,
    };
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      return {
        success: false,
        data: e.response.data.message,
        code: e.response.status,
      };
    }
    return {
      success: false,
      data: 'error',
      code: 500,
    };
  }
};

export default service;
