import {Platform} from 'react-native';

type StyleFont =
  | '100'
  | '100-I'
  | '300'
  | '300-I'
  | '400'
  | '400-I'
  | '500'
  | '500-I'
  | '700'
  | '700-I'
  | '800'
  | '800-I';

const getWeight = (str: string) => {
  switch (str) {
    case '100':
      return 'Light';

    case '300':
      return 'Book';

    case '400':
      return 'Medium';

    case '500':
      return 'Demi';

    case '700':
      return 'Bold';

    case '800':
      return 'ExtraBold';
  }
};

export const getFontFamily = (style: StyleFont) => {
  const [weight, obl] = style.split('-');
  return `FuturaPT-${getWeight(weight)}${obl ? 'Obl' : ''}`;
};
