import config from '../config/config';
import {IImgProduct} from '../typings/FetchData';
import {IImage} from '../typings/IImage';

const getUrlImg = (name: IImage | IImgProduct | string | null) => {
  if (!name) return require('../assets/images/pic-default.png'); //todo default image

  if (typeof name === 'string') {
    return {
      uri: config.baseUrlImg + name,
    };
  }

  return {
    uri: config.baseUrlImg + name.uuid,
  };
};

export default getUrlImg;
