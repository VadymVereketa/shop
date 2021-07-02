import {AxiosRequestConfig} from 'axios';
import buildQuery from '../utils/buildQuery';
import {IGetProducts} from '../typings/ServiceTypes';
import {Platform} from 'react-native';

const queries = {
  getExpressSellPoints: () => {
    const filter = {
      isActive: true,
    };
    const query = buildQuery({filter});

    const config: AxiosRequestConfig = {
      url: 'express/sell_points' + query,
      method: 'get',
    };

    return config;
  },
  getRestaurants: () => {
    const filter = {};
    const query = buildQuery({filter, orderBy: 'id'});

    const config: AxiosRequestConfig = {
      url: 'sell_points' + query,
      method: 'get',
    };

    return config;
  },
  getProducts: ({
    top,
    skip,
    title = '',
    idCategory,
    idTag,
    idSellPoint,
  }: IGetProducts) => {
    const categoryFilter = {
      'productOptions/available': true,
    };

    if (!idCategory) {
      categoryFilter['customCategory'] = {
        ne: null,
      };
    } else if (idCategory) {
      if (Array.isArray(idCategory)) {
        categoryFilter['customCategory/id'] = {
          in: idCategory.map((c) => +c),
        };
      } else {
        categoryFilter['customCategory/id'] = idCategory;
      }
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
        `products${idSellPoint ? `/sell_point/${idSellPoint}` : ''}` +
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

  getProductByExpress: (id: number) => {
    const filter = `$filter=(isActive%20eq%20true and productOptions/price ne 0 and expCollections/id ne null and customCategory ne null)&$expand=expCollections($filter=expCollections/sellPoint/id eq ${id} and expCollections/count gt 0 and expCollections/deletedDate eq null)&$count=true&$orderby=title%20asc`;

    const config: AxiosRequestConfig = {
      url: `products?` + filter,
      method: 'get',
    };
    return config;
  },
  getOrders: ({top, skip}: {top: number; skip: number}) => {
    const filter = {
      'orderStatus/code': {
        ne: 'draftWeb',
      },
    };
    const config: AxiosRequestConfig = {
      url:
        '/clients/orders/' +
        buildQuery({
          count: true,
          filter,
          top,
          skip,
          orderBy: 'createdDate desc',
        }),
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
