import I18n from 'react-native-i18n';
import {ITranslate} from '../assets/translations/uk';

const t = (str: ITranslate[] | ITranslate) => {
  return I18n.t(str);
};

export default t;
