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
import {useDispatch, useSelector} from 'react-redux';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';
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
  const dispatch = useDispatch();
  const theme = useSelector(selectorsOther.getTheme);

  const value: IThemeContext = useMemo(() => {
    const primary = theme === 'light' ? '#01a6e6' : '#01a6e6';
    const accent = theme === 'light' ? '#18aa13' : '#18aa13';
    const background = theme === 'light' ? '#fff' : '#212126';
    const lightBackground = theme === 'light' ? '#f2f4fa' : '#3c4162';
    const lightText = theme === 'light' ? '#a0a9ba' : '#a0a9ba';
    const darkText = theme === 'light' ? '#121826' : '#f3f4f8';
    const text = theme === 'light' ? '#3c4162' : '#dadeea';
    const border = theme === 'light' ? '#dadeea' : '#3c4162';
    const errorColor = theme === 'light' ? '#dc3545' : '#dc3545';

    return {
      onChangeTheme: (theme: Theme) => {
        dispatch(
          actionsOther.setData({
            theme,
          }),
        );
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
