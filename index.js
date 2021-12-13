import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ProviderTheme from './src/context/ThemeContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import configureStore from './src/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import ProviderFormattingContext from './src/context/FormattingContext';
import {
  serviceGetCustomCategories,
  thunkGetCustomCategories,
  thunkGetTags,
} from './src/redux/category/categoryReducer';
import {fetchGetAllSettings} from './src/redux/other/otherReducer';
import {
  thunkGetExpressSellPoints,
  thunkGetSellPoints,
} from './src/redux/sellPoints/sellPointsReducer';
import I18n from 'react-native-i18n';
import en from './src/assets/translations/en';
import uk from './src/assets/translations/uk';
import ru from './src/assets/translations/ru';
import {actionsUser, refreshUser} from './src/redux/user/userReducer';
import service from './src/services/service';
import {actionsCart} from './src/redux/cart/cartReducer';
import {DEFAULT_NAME_SETTING} from './src/constants/constantsId';
import {Host} from 'react-native-portalize';
import messaging from '@react-native-firebase/messaging';
import {
  switchHandlerMessaging,
  TypeHandlerMessaging,
} from './src/useHooks/useHandlerMessaging';
import {isIOS} from './src/utils/isPlatform';
import {thunkGetTypes} from './src/redux/types/typeReducer';
import AsyncStorage from '@react-native-community/async-storage';
import {thunkGetAllCities} from './src/redux/city/cityReducer';

I18n.defaultLocale = 'uk';
I18n.fallbacks = true;

I18n.translations = {
  uk,
  en,
  ru,
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(
    '------------------>    ' +
      (isIOS ? 'IOS' : 'ANDROID') +
      ': Message handled in the background!',
    remoteMessage,
  );
  switchHandlerMessaging({
    type: TypeHandlerMessaging.background,
    payload: remoteMessage,
  });
});

const store = configureStore();
store.store.dispatch(serviceGetCustomCategories);
store.store.dispatch(thunkGetTags);
store.store.dispatch(fetchGetAllSettings);
store.store.dispatch(thunkGetSellPoints);
store.store.dispatch(thunkGetTypes);
store.store.dispatch(thunkGetAllCities);

const handleAppStateChange = async (nextAppState) => {
  try {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      const root = store.store.getState();
      const isAuth = root.user.isAuth;
      if (!isAuth) return;

      const items = root.cart.data;
      const idDeliveryType = root.order.deliveryType?.id;
      const id = root.cart.idSellPoint
        ? root.cart.idSellPoint
        : root.other.settings[DEFAULT_NAME_SETTING].default_price_sell_point;

      if (items.length > 0 && idDeliveryType) {
        service.saveCart(items, id, idDeliveryType);
      } else {
        service.deleteCart();
      }
    }
  } catch (e) {
    console.log({e});
  }
};

AppState.addEventListener('change', handleAppStateChange);

export const getToken = () => {
  return store.store.getState().user.token;
};

export const getLocale = async () => {
  return (
    (await AsyncStorage.getItem('locale')) ||
    store.store.getState().other.locale
  );
};

export const logOut = () => {
  store.store.dispatch(actionsUser.logout());
};

const Main = () => {
  return (
    <Provider store={store.store}>
      <PersistGate loading={null} persistor={store.persistor}>
        <ProviderFormattingContext>
          <SafeAreaProvider>
            <ProviderTheme>
              <Host>
                <App />
              </Host>
            </ProviderTheme>
          </SafeAreaProvider>
        </ProviderFormattingContext>
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Main);
