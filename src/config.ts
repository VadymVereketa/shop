type M = 'dev' | 'test' | 'prod' | 'uat';
const MODE: string = 'dev';

const config = (() => {
  switch (MODE) {
    case 'dev':
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'http://192.168.31.66:3008/api/v1/',
        baseURLV2: 'http://192.168.31.66:3008/api/v2/',
        baseURLCallback: 'http://192.168.31.66:3004/api/v1/',
        baseUrlImg: 'http://huspi.com:3026/api/v1/images/',
        payeeId: '26298',
      };
    case 'prod':
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'https://client-api.egersund.ua/api/v1/',
        baseURLV2: 'https://client-api.egersund.ua/api/v2/',
        baseURLCallback: 'http://huspi.com:3024/api/v1/',
        baseUrlImg: 'https://client-api.egersund.ua/api/v1/images/',
        payeeId: '26298',
      };
    case 'uat':
      return {
        canLink: 'https://huspi.com:3022',
        baseURL: 'https://egersund-uat.mobile-api.huspi.com/api/v1/',
        baseURLV2: 'https://egersund-uat.mobile-api.huspi.com/api/v2/',
        baseURLCallback: 'https://huspi.com:3048/api/v2/',
        baseUrlImg: 'https://egersund-uat.mobile-api.huspi.com/api/v1/images/',
        payeeId: '26298',
      };
    default:
      //todo test
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'http://huspi.com:3026/api/v1/',
        baseURLV2: 'http://huspi.com:3026/api/v2/',
        baseURLCallback: 'http://huspi.com:3024/api/v1/',
        baseUrlImg: 'http://huspi.com:3026/api/v1/images/',
        payeeId: '26298',
      };
  }
})();

export {MODE};
export default config;
