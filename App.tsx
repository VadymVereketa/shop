import {NavigationContainer, Theme} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/components/navigators/Start.navigator';
import {AppState, Platform, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {refreshUser} from './src/redux/user/userReducer';
import {actionsCart, selectorsCart} from './src/redux/cart/cartReducer';
import service from './src/services/service';
import {useFormattingContext} from './src/context/FormattingContext';
import portmone from './src/utils/portmone';

const App = () => {
  const dispatch = useDispatch();
  const {theme, onChangeTheme, ...colors} = useTheme();
  const {currentLocale} = useFormattingContext();

  const MyTheme: Theme = {
    dark: theme === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      border: colors.border,
      card: colors.background,
      text: colors.text,
      notification: 'red',
    },
  };

  useEffect(() => {
    dispatch(refreshUser);
    service.getCart().then((res) => {
      if (res.length > 0) {
        dispatch(actionsCart.setData(res));
      }
    });

    portmone.invokePortmoneSdk({
      theme,
      lang: currentLocale,
      type: 'phone',
    });
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar
        hidden={Platform.OS === 'android'}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <StartNavigator />
    </NavigationContainer>
  );
};

export default App;
