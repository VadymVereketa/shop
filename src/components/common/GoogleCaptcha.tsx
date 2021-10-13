import React, {useEffect, useRef} from 'react';
import config from '../../config/config';
import Recaptcha from 'react-native-recaptcha-that-works';

interface IGoogleCaptchaProps {
  onConfirm: (token: string) => any;
}
const GoogleCaptcha = ({onConfirm}: IGoogleCaptchaProps) => {
  const _captchaRef = useRef<any>();

  useEffect(() => {
    _captchaRef.current.open();
  }, []);

  const onVerify = (token) => {
    if (!token) {
      return;
    }
    onConfirm(token);
  };

  const onExpire = () => {
    console.warn('expired!');
  };

  return (
    <Recaptcha
      ref={_captchaRef}
      siteKey={config.siteKeyreCAPTCHA}
      baseUrl={config.captchaDomain}
      onVerify={onVerify}
      onExpire={onExpire}
      size="invisible"
    />
  );
};

export default GoogleCaptcha;
