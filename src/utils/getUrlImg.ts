import config from '../config';

const getUrlImg = (name: string | null) => {
  if (!name) return require('../assets/images/pic-default.png'); //todo default image

  return {
    uri: config.baseUrlImg + name,
  };
};

export default getUrlImg;
