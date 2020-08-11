import React, {useContext, useMemo, useState} from 'react';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
} from 'react-native-global-props';
import {Platform} from 'react-native';


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
    const background = theme === 'light' ? 'transparent' : '#3c4162';
    const card = theme === 'light' ? '#fff' : '#fff';
    const text = theme === 'light' ? '#3c4162' : '#fff';
    const border = theme === 'light' ? '#dadeea' : '#fff';
    const notification = theme === 'light' ? '#810' : '#810';

    const customTextProps = {
      style: {
        fontSize: 14,
        color: text,
      },
    };

    const customViewProps = {
      style: {
        backgroundColor: background,
      },
    };

    const customTextInputProps = {
      underlineColorAndroid: 'rgba(0,0,0,0)',
      style: {
        fontSize: 14,
        backgroundColor: 'transparent',
        color: text,
      },
    };

    setCustomView(customViewProps);
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

export {useTheme};
export default ProviderTheme;
