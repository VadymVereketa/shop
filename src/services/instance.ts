import axios from 'axios';
import config from '../config';
import {getLocale, getToken} from '../../index';

const instance = axios.create({
  baseURL: config.baseURL,
  //withCredentials: true
});

instance.interceptors.request.use(
  (value) => {
    const token = getToken();
    value.headers = {
      ...instance.defaults.headers,
      'Accept-Language': getLocale() || 'uk',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
    console.log(value);
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
    console.log({error});
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
