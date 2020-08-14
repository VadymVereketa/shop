import React, {useContext, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';
import {FRACTION_DIGIT, ID_UNIT_WEIGHT} from '../constants/constantsId';

export interface IFormattingContext {
  currentLocale: Locale;
  setLocale: (l: Locale) => any;
  formatPrice: (n: number) => string;
  formatUnit: (value: number, weight: typeof ID_UNIT_WEIGHT | string) => string;
  format1000Unit: (value: number) => string;
  formatDate: (d: Date) => string;
  longFormatDate: (d: Date) => string;
  defaultPhoneCustom: boolean;
  defaultPhone: string;
}

interface IFormattingContextProps {
  locale?: Locale;
}

export type Locale = 'en' | 'uk';

interface IConstant {
  currency: string;
  w1000: string;
  w100: string;
  piece: string;
}

type ILocaleConstant = {
  [name in Locale]: IConstant;
};

const CONSTANTS_UNIT: ILocaleConstant = {
  en: {
    currency: 'UAH',
    piece: '',
    w100: 'gr',
    w1000: 'kg',
  },
  uk: {
    currency: 'грн',
    piece: 'шт',
    w100: 'г',
    w1000: 'кг',
  },
};

const formatDate = (
  d: Date,
  isLongFormat: boolean = false,
  locale: Locale = 'uk',
) => {
  const separator = locale === 'uk' ? '.' : '/';
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  let arr =
    locale === 'uk'
      ? [day, month.toString().padStart(2, '0')]
      : [month.toString().padStart(2, '0'), day];
  arr = isLongFormat ? [...arr, year] : arr;
  return arr.join(separator);
};

const FormattingContext = React.createContext({} as IFormattingContext);

const useFormattingContext = () => {
  return useContext(FormattingContext);
};
const ProviderFormattingContext: React.FC<IFormattingContextProps> = ({
  children,
}) => {
  const dispatch = useDispatch();

  const currentLocale = useSelector(selectorsOther.getLocale) || 'uk';
  const value: IFormattingContext = useMemo(() => {
    return {
      currentLocale,
      setLocale: (locale: Locale) => {
        dispatch(actionsOther.setLocale(locale));
      },
      formatPrice: (price: number) => {
        return `${price.toFixed(2)} ${CONSTANTS_UNIT[currentLocale].currency}`;
      },
      formatUnit: (value: number, unit: string) => {
        let strValue = value.toFixed(FRACTION_DIGIT);
        strValue = strValue.replace(/\.?[0]*$/, '');
        if (unit === ID_UNIT_WEIGHT) {
          if (value >= 1) {
            return `${strValue} ${CONSTANTS_UNIT[currentLocale].w1000}`;
          }
          return `${(value * 1000).toFixed(0)} ${
            CONSTANTS_UNIT[currentLocale].w100
          }`;
        } else {
          return `${value} ${CONSTANTS_UNIT[currentLocale].piece}`;
        }
      },
      format1000Unit: (value: number) => {
        return `${(value * 1000).toFixed(0)} ${
          CONSTANTS_UNIT[currentLocale].w100
        }`;
      },
      formatDate: (date: Date) => {
        return formatDate(date, false, currentLocale);
      },
      longFormatDate: (date: Date) => {
        return formatDate(date, true, currentLocale);
      },
      defaultPhoneCustom: currentLocale === 'en',
      defaultPhone: currentLocale === 'en' ? '' : '+380',
    };
  }, [currentLocale]);

  useEffect(() => {
    if (!currentLocale) {
      dispatch(
        actionsOther.setData({
          locale: 'uk',
        }),
      );
    }
  }, []);

  return (
    <FormattingContext.Provider value={value}>
      {children}
    </FormattingContext.Provider>
  );
};

export {useFormattingContext, CONSTANTS_UNIT};
export default ProviderFormattingContext;
