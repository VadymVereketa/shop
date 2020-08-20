import axios from 'axios';
import config from '../config';
import {getLocale, getToken} from '../../index';

const instance = axios.create({
  baseURL: config.baseURL,
  //withCredentials: true
});
//%27%25D1%2581%25D0%25B0%27
//%27%25D1%2581%25D0%25B0%27
//'%2525D1%252581%2525D0%2525B0'
instance.interceptors.request.use(
  (value) => {
    const token = getToken();
    value.headers = {
      ...instance.defaults.headers,
      'Accept-Language': getLocale() || 'uk',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
    return value;
  },
  (error) => {
    throw error;
  },
);

instance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    if (
      !(error.response && error.response.data && error.response.data.message)
    ) {
      error.response = {
        data: {
          message: error.message,
        },
      };
    }
    throw error;
  },
);

export default instance;
