type M = 'dev' | 'test' | 'prod';
const MODE: string = 'dev';

const config = (() => {
  switch (MODE) {
    case 'test':
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'http://huspi.com:3026/api/v1/',
        baseURLV2: 'http://huspi.com:3026/api/v2/',
        baseURLCallback: 'http://huspi.com:3024/api/v1/',
        baseUrlImg: 'http://huspi.com:3026/api/v1/images/',
        payeeId: '25989',
      };
    case 'prod':
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'http://huspi.com:3026/api/v1/',
        baseURLV2: 'http://huspi.com:3026/api/v2/',
        baseURLCallback: 'http://huspi.com:3024/api/v1/',
        baseUrlImg: 'http://huspi.com:3026/api/v1/images/',
        payeeId: '25989',
      };
    default:
      return {
        canLink: 'http://huspi.com:3022',
        baseURL: 'http://192.168.31.66:3006/api/v1/',
        baseURLV2: 'http://192.168.31.66:3006/api/v2/',
        baseURLCallback: 'http://192.168.31.66:3004/api/v1/',
        baseUrlImg: 'http://huspi.com:3026/api/v1/images/',
        payeeId: '25989',
      };
  }
})();

export {MODE};
export default config;
