import React, {useContext, useMemo, useState} from 'react';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
} from 'react-native-global-props';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import {getFontFamily} from '../utils/getFontFamily';
import {Dimensions} from 'react-native';
const window = Dimensions.get('window');

export type Theme = 'dark' | 'light';

interface IThemeContext {
  onChangeTheme: (theme: Theme) => any;
  theme: Theme;

  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

const ThemeContext = React.createContext({} as IThemeContext);

const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};

const ProviderTheme = ({children}: any) => {
  const [theme, setTheme] = useState('light' as Theme);

  const value: IThemeContext = useMemo(() => {
    const primary = theme === 'light' ? '#01a6e6' : '#01a6e6';
    const background = theme === 'light' ? '#fff' : '#3c4162';
    const card = theme === 'light' ? '#fff' : '#fff';
    const text = theme === 'light' ? '#3c4162' : '#fff';
    const border = theme === 'light' ? '#dadeea' : '#fff';
    const notification = theme === 'light' ? '#810' : '#810';

    const customTextProps = {
      style: {
        fontSize: sizes[8],
        color: text,
        fontFamily: getFontFamily('300')
      },
    };

    const customTextInputProps = {
      underlineColorAndroid: 'rgba(0,0,0,0)',
      style: {
        fontSize: sizes[8],
        backgroundColor: 'transparent',
        color: text,
        fontFamily: getFontFamily('300')
      },
    };

    setCustomTextInput(customTextInputProps);
    setCustomText(customTextProps);

    return {
      onChangeTheme: (theme: Theme) => {
        setTheme(theme);
      },
      theme,
      primary,
      background,
      card,
      text,
      border,
      notification
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

const isTablet = window.width > 600;

const f = (z: number) => {
  const x = (16 / 9) * 187.5;

  return (100 * z) / ( Math.sqrt(
    Math.pow(x, 2) + Math.pow(187.5, 2)
  ))
};

const sizes: any = {
};

for(let i = 4; i <= 50; i++) {
  sizes[i] = responsiveFontSize(f(i) * (isTablet ? 0.5 : 1));
}

export {useTheme, sizes};
export default ProviderTheme;
