import axios from 'axios';
import config from '../config';

const instance = axios.create({
  baseURL: config.baseURL,
  //withCredentials: true
});

instance.interceptors.request.use(
  (value) => {
    //todo locale
    value.headers = {
      'Accept-Language': 'ua',
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
