type M = 'dev' | 'test' | 'prod' | 'uat';
const MODE: string = 'prod';

const config = (() => {
  switch (MODE) {
    case 'dev':
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'http://192.168.0.100:3006/api/v1/',
        baseURLV2: 'http://192.168.0.100:3006/api/v2/',
        baseURLCallback: 'http://192.168.0.100:3004/api/v1/',
        baseUrlImg: 'http://huspi.com:3026/api/v1/images/',
        payeeId: '26298',
        domen: 'http://huspi.com:3022/',
      };
    case 'prod':
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'https://client-api.egersund.ua/api/v1/',
        baseURLV2: 'https://client-api.egersund.ua/api/v2/',
        baseURLCallback: 'https://integration-api.egersund.ua/api/v1/',
        baseUrlImg: 'https://client-api.egersund.ua/api/v1/images/',
        payeeId: '25989',
        domen: 'https://shop.egersund.ua',

        /* canLink: 'http://huspi.com:3022',
        baseURL: 'http://huspi.com:3078/api/v1/',
        baseURLV2: 'http://huspi.com:3078/api/v2/',
        baseURLCallback: 'http://huspi.com:3074/api/v1/',
        baseUrlImg: 'https://client-api.egersund.ua/api/v1/images/',
        payeeId: '25989',
        domen: 'http://huspi.com:3042/',*/
      };
    case 'uat':
      return {
        canLink: 'https://huspi.com:3022',
        baseURL: 'https://egersund-uat.mobile-api.huspi.com/api/v1/',
        baseURLV2: 'https://egersund-uat.mobile-api.huspi.com/api/v2/',
        baseURLCallback:
          'https://egersund-uat.integration-api.huspi.com/api/v1/',
        baseUrlImg: 'https://egersund-uat.mobile-api.huspi.com/api/v1/images/',
        payeeId: '26298',
        domen: 'https://egersund-uat-web.huspi.com',

        /* canLink: 'http://huspi.com:3022',
        baseURL: 'http://huspi.com:3048/api/v1/',
        baseURLV2: 'http://huspi.com:3048/api/v2/',
        baseURLCallback: 'http://huspi.com:3044/api/v1/',
        baseUrlImg: 'http://huspi.com:3046/api/v1/images/',
        payeeId: '26298',
        domen: 'http://huspi.com:3042/',*/
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
        domen: 'http://huspi.com:3022/',
      };
  }
})();

export {MODE};
export default config;
