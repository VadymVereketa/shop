enum Mode {
  LOCAL = 'LOCAL',
  DEV = 'DEV',
  PROD = 'PROD',
  UAT = 'UAT',
}
const mode: any = Mode.PROD;

const config = (() => {
  switch (mode) {
    case Mode.DEV:
      return {
        captchaDomain: 'http://huspi.com:3022',
        baseURL: 'http://192.168.0.100:3006/api/v1/',
        baseURLV2: 'http://192.168.0.100:3006/api/v2/',
        baseURLCallback: 'http://192.168.0.100:3004/api/v1/',
        baseUrlImg: 'http://huspi.com:3026/api/v1/images/',
        payeeId: '26298',
        domen: 'http://huspi.com:3022/',
        siteKeyreCAPTCHA: '6LdPDk8cAAAAANiQW-DBz7Iltm_HtzovG18NcVL4',
      };
    case Mode.PROD:
      return {
        captchaDomain: 'https://egersund.ua/',
        baseURL: 'https://client-api.egersund.ua/api/v1/',
        baseURLV2: 'https://client-api.egersund.ua/api/v2/',
        baseURLCallback: 'https://integration-api.egersund.ua/api/v1/',
        baseUrlImg: 'https://client-api.egersund.ua/api/v1/images/',
        payeeId: '25989',
        domen: 'https://egersund.ua',
        siteKeyreCAPTCHA: '6LdPDk8cAAAAANiQW-DBz7Iltm_HtzovG18NcVL4',

        /* canLink: 'http://huspi.com:3022',
        baseURL: 'http://huspi.com:3078/api/v1/',
        baseURLV2: 'http://huspi.com:3078/api/v2/',
        baseURLCallback: 'http://huspi.com:3074/api/v1/',
        baseUrlImg: 'https://client-api.egersund.ua/api/v1/images/',
        payeeId: '25989',
        domen: 'http://huspi.com:3042/',*/
      };
    case Mode.UAT:
      return {
        baseURL: 'https://egersund-uat-client.huspi.com/api/v1/',
        baseURLV2: 'https://egersund-uat-client.huspi.com/api/v2/',
        baseURLCallback: 'https://egersund-uat.integration-api/api/v1/',
        baseUrlImg: 'https://egersund-uat-client.huspi.com/api/v1/images/',
        payeeId: '26298',
        domen: 'https://egersund-uat-web.huspi.com',
        captchaDomain: 'https://egersund-uat-web.huspi.com',
        siteKeyreCAPTCHA: '6LdPDk8cAAAAANiQW-DBz7Iltm_HtzovG18NcVL4',

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
        baseURL: 'http://192.168.31.65:3006/api/v1/',
        baseURLV2: 'http://192.168.31.65:3006/api/v2/',
        baseURLCallback: 'http://huspi.com:3024/api/v1/',
        baseUrlImg: 'http://192.168.31.65:3006/api/v1/images/',
        payeeId: '26298',
        domen: 'http://huspi.com:3022/',
        siteKeyreCAPTCHA: '6LdPDk8cAAAAANiQW-DBz7Iltm_HtzovG18NcVL4',
        captchaDomain: 'https://egersund-uat-web.huspi.com',
      };
  }
})();

export {Mode, mode};
export default config;
