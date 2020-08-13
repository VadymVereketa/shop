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
} from '../typings/FetchData';
import {IOrderPost} from '../typings/ServiceTypes';
import queries from './queries';
import {IOrderState} from '../redux/order/orderTypes';
import config from '../config';
import {getWithoutCodePhone} from '../utils/normalizePhone';
import buildQuery from '../utils/buildQuery';
import {AxiosResponse} from 'axios';
import {FRACTION_DIGIT, TypeDelivery} from '../constants/constantsId';
import {formatAddress} from '../utils/formatAddress';

const service = {
  getSellPoints: async () => {
    return await customFetch(() => instance.get(queries.getRestaurants().url!));
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
  getProducts: async (ids: number[]) => {
    const filter = {
      or: ids.map((id) => ({id: id})),
    };
    return await customFetch(() =>
      instance.get('/products' + buildQuery({filter})),
    );
  },
  login: async (phone: string, password: string) => {
    return await customFetch(() =>
      instance.post<IUser>(
        'auth/login',
        {
          phone,
          password,
        },
        {
          withCredentials: true,
        },
      ),
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
      await instance.post(
        'auth/logout',
        {},
        {
          withCredentials: true,
        },
      );
      return true;
    } catch (e) {
      return false;
    }
  },
  refreshUser: async (headers?: any) => {
    try {
      const res = await instance.get('clients/profile', {
        withCredentials: true,
        headers,
      });
      return res.data;
    } catch (e) {
      return null;
    }
  },
  saveCart: async (products: ICartItem[], idSellPoint: number) => {
    const data = {
      cartProducts: products.map((p) => {
        return {
          count: +p.count.toFixed(FRACTION_DIGIT),
          product: {
            id: p.product.id,
          },
          comment: p.comment,
          alternativeCount: p.alternativeCount
            ? p.alternativeCount.toString()
            : null,
        };
      }),
      sellPoint: {
        id: idSellPoint,
      },
    };
    return await customFetch(() =>
      instance.put<IUpdateCart>('clients/cart', data, {
        withCredentials: true,
      }),
    );
  },
  deleteCart: () => {
    //todo delete cart
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
        return res.data.cartProducts;
      }
      return [];
    } catch (e) {
      return [];
    }
  },
  createOrder: async (
    draftId: number,
    data: IOrderState,
    isAnon: boolean = false,
  ) => {
    const receiver = data.contact;
    let contact: any = {};
    const addressData: any = {};
    if (isAnon && receiver) {
      const [firstName, lastName] = receiver.name.split(' ');
      contact = {
        firstName,
        lastName,
        phone: receiver.isPhoneCustom
          ? receiver.phone
          : getWithoutCodePhone(receiver.phone),
      };
    } else if (receiver) {
      contact = {
        contact: {
          id: receiver.id!,
        },
      };
    }
    if (data.deliveryType!.code === TypeDelivery.courier) {
      if (isAnon) {
        addressData.orderAddress = formatAddress(data.address);
      } else {
        addressData.address = {
          id: data.addressId !== -1 ? data.addressId : data.address!.id,
        };
      }
    }

    const [minTime, maxTime] = data.time.split('-');
    const [maxH, maxM] = maxTime.split(':').map(parseFloat);
    const [minH, minM] = minTime.split(':').map(parseFloat);

    const maxExecuteDate = new Date(data.date);
    maxExecuteDate.setHours(maxH, maxM);

    const minExecuteDate = new Date(data.date);
    minExecuteDate.setHours(minH, minM);

    const fetchData: IOrderPost = {
      id: draftId,
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
      const res = await instance.post('clients/order', fetchData, {
        withCredentials: true,
      });

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
    return await customFetch(() =>
      instance.put('auth/change_password', data, {
        withCredentials: true,
      }),
    );
  },
  updateProfile: async (data: any) => {
    return await customFetch(() =>
      instance.put('clients/profile', data, {
        withCredentials: true,
      }),
    );
  },
  addAddress: async (data: Omit<IAddress, 'id'>) => {
    return await customFetch(() =>
      instance.post('clients/addresses', data, {
        withCredentials: true,
      }),
    );
  },
  updateAddress: async (data: IAddress) => {
    const id = data.id;
    delete data.id;
    return await customFetch(() =>
      instance.put(`clients/addresses/${id}`, data, {
        withCredentials: true,
      }),
    );
  },
  deleteAddress: async (id: number) => {
    return await customFetch(() =>
      instance.delete(`clients/addresses/${id}`, {
        withCredentials: true,
      }),
    );
  },
  addContact: async (data: Omit<IContact, 'id'>) => {
    return await customFetch(() =>
      instance.post('clients/contacts', data, {
        withCredentials: true,
      }),
    );
  },
  updateContact: async (data: IContact) => {
    const id = data.id;
    delete data.id;
    return await customFetch(() =>
      instance.put(`clients/contacts/${id}`, data, {
        withCredentials: true,
      }),
    );
  },
  deleteContact: async (id: number) => {
    return await customFetch(() =>
      instance.delete(`clients/contacts/${id}`, {
        withCredentials: true,
      }),
    );
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
      const res = await instance.get<IDefaultSetting[]>(
        'setups/settings' + buildQuery({filter, expand: 'platformType'}),
        {
          params: {
            skip: 0,
            top: 50,
          },
        },
      );
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
  createDraft: async () => {
    return await customFetch(() => instance.post('clients/order/draft'));
  },
};

const customFetch = async <T>(func: () => Promise<AxiosResponse<T>>) => {
  try {
    const res = await func();

    return {
      success: true,
      data: res.data,
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
