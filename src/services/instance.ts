import axios from 'axios';
import config from '../config/config';
import {getLocale, getToken, logOut} from '../../index';
import {isIOS} from '../utils/isPlatform';
import {ANDROID_VERSION, IOS_VERSION} from '../config/configVersion';

const instance = axios.create({
  baseURL: config.baseURL,
  //withCredentials: true
});

instance.interceptors.request.use(
  async (value) => {
    const token = getToken();
    value.headers = {
      ...instance.defaults.headers,
      'Accept-Language': (await getLocale()) || 'uk',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
      'Platform-OS': isIOS ? 'iOS' : 'Android',
      'App-Version': isIOS ? IOS_VERSION : ANDROID_VERSION,
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
    console.error({error});
    if (error.response.status === 401) {
      logOut();
    }
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
