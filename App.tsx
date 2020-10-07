import {NavigationContainer, Theme} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/components/navigators/Start.navigator';
import {AppState, Linking, Platform, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {refreshUser} from './src/redux/user/userReducer';
import {actionsCart, selectorsCart} from './src/redux/cart/cartReducer';
import service from './src/services/service';
import {useFormattingContext} from './src/context/FormattingContext';
import portmone from './src/utils/portmone';
import config from './src/config';
import DeepLinking from 'react-native-deep-linking';

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

  const handleUrl = ({url}: any) => {
    console.log(url);
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };

  const addRoutesToDeepLinking = () => {
    DeepLinking.addScheme('https://');

    DeepLinking.addRoute(
      '/egersund-uat-web.huspi.com/products/1/5',
      (response) => {
        console.log('/egersund-uat-web.huspi.com/products/1/5');
        console.log(response);
      },
    );

    DeepLinking.addRoute('/egersund-uat-web.huspi.com', (response) => {
      console.log('/egersund-uat-web.huspi.com');
      console.log(response);
    });

    DeepLinking.addRoute(
      '/egersund-uat-web.huspi.com/#/avialosos',
      (response) => {
        console.log('/egersund-uat-web.huspi.com/#/avialosos');
        console.log(response);
      },
    );

    DeepLinking.addRoute('/egersund-uat-web.huspi.com/shops', (response) => {
      console.log('/egersund-uat-web.huspi.com/shops');
      console.log(response);
    });
  };

  useEffect(() => {
    addRoutesToDeepLinking();
    Linking.addEventListener('url', handleUrl);

    dispatch(refreshUser);
    service.getCart().then((res) => {
      if (res.length > 0) {
        dispatch(actionsCart.setData(res));
      }
    });

    if (Platform.OS === 'android') {
      portmone.invokePortmoneSdk({
        theme,
        lang: currentLocale,
        type: 'phone',
      });
    }
    return () => {
      Linking.removeEventListener('url', handleUrl);
    };
  }, []);

  return (
    <NavigationContainer
      theme={MyTheme}
      linking={{
        prefixes: [config.domen],
      }}>
      <StatusBar
        hidden={Platform.OS === 'android'}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <StartNavigator />
    </NavigationContainer>
  );
};

export default App;
