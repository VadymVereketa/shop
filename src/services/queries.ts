import {AxiosRequestConfig} from 'axios';
import buildQuery from '../utils/buildQuery';
import {IGetProducts} from '../typings/ServiceTypes';
import {Platform} from 'react-native';

const queries = {
  getRestaurants: () => {
    const filter = {};
    const query = buildQuery({filter, orderBy: 'id'});

    const config: AxiosRequestConfig = {
      url: 'sell_points' + query,
      method: 'get',
    };

    return config;
  },
  getProducts: ({top, skip, title = '', idCategory, idTag}: IGetProducts) => {
    const categoryFilter = {
      'productOptions/available': true,
    };

    if (!idCategory) {
      categoryFilter['customCategory'] = {
        ne: null,
      };
    } else if (idCategory) {
      categoryFilter['customCategory/id'] = idCategory;
    }
    if (idTag) {
      categoryFilter['groups/id'] = idTag;
      categoryFilter['customCategory'] = {
        ne: null,
      };
    }
    const filter = {
      and: [
        {
          'tolower(title)': {
            contains:
              Platform.OS === 'ios'
                ? '###'
                : encodeURIComponent(title.toLowerCase()),
          },
        },
        {
          isActive: true,
        },
        categoryFilter,
      ],
    };

    const config: AxiosRequestConfig = {
      url:
        '/products/' +
        buildQuery({
          filter,
          count: true,
          top,
          skip,
          orderBy: 'productOptions/available desc',
        }),
      method: 'get',
    };
    config.url = config!.url!.replace(
      '%23%23%23',
      encodeURIComponent(title.toLowerCase()),
    );
    return config;
  },
  getOrders: ({top, skip}: {top: number; skip: number}) => {
    const config: AxiosRequestConfig = {
      url:
        '/clients/orders/' +
        buildQuery({count: true, top, skip, orderBy: 'createdDate desc'}),
      method: 'get',
      withCredentials: true,
    };
    return config;
  },
  getProduct: (id: string | number) => {
    const config: AxiosRequestConfig = {
      url: '/products/' + id,
      method: 'get',
    };
    return config;
  },
  getDeliveryTypes: () => {
    const config: AxiosRequestConfig = {
      url: '/delivery_types',
      method: 'get',
    };
    return config;
  },
  getPaymentTypes: () => {
    const config: AxiosRequestConfig = {
      url: '/payment_types',
      method: 'get',
    };
    return config;
  },
  getTags: () => {
    const filter = {
      isActive: true,
    };
    const config: AxiosRequestConfig = {
      url: '/product_groups' + buildQuery({orderBy: 'ord asc', filter}),
      method: 'get',
    };
    return config;
  },
  getProductsByTag: (id: number) => {
    const config: AxiosRequestConfig = {
      url: '/product_groups/' + id,
      method: 'get',
    };
    return config;
  },
};

export default queries;
