import React, {useContext, useMemo, useState} from 'react';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
} from 'react-native-global-props';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {getFontFamily} from '../utils/getFontFamily';
import {Dimensions} from 'react-native';
const window = Dimensions.get('window');

export type Theme = 'dark' | 'light';

interface IThemeContext {
  onChangeTheme: (theme: Theme) => any;
  theme: Theme;

  primary: string;
  accent: string;
  background: string;
  lightBackground: string;
  border: string;
  text: string;
  lightText: string;
  darkText: string;
  errorColor: string;
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
    const accent = theme === 'light' ? '#18aa13' : '#18aa13';
    const background = theme === 'light' ? '#fff' : '#3c4162';
    const lightBackground = theme === 'light' ? '#f2f4fa' : '#f2f4fa';
    const lightText = theme === 'light' ? '#a0a9ba' : '#fff';
    const darkText = theme === 'light' ? '#121826' : '#fff';
    const text = theme === 'light' ? '#3c4162' : '#fff';
    const border = theme === 'light' ? '#dadeea' : '#fff';
    const errorColor = theme === 'light' ? '#dc3545' : '#dc3545';

    return {
      onChangeTheme: (theme: Theme) => {
        setTheme(theme);
      },
      theme,
      primary,
      background,
      lightText,
      text,
      border,
      accent,
      darkText,
      lightBackground,
      errorColor,
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

const isTablet = Math.min(window.height, window.width) > 600;

const f = (z: number) => {
  const x = (16 / 9) * 187.5;

  return (100 * z) / Math.sqrt(Math.pow(x, 2) + Math.pow(187.5, 2));
};

const sizes: any = {};
const widths: any = {};

for (let i = 1; i <= 100; i++) {
  sizes[i] = responsiveFontSize(f(i) * (isTablet ? 0.7 : 1));
  widths[i] = responsiveFontSize(f(i));
}

export {useTheme, sizes, widths};
export default ProviderTheme;
