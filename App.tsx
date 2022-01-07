import {NavigationContainer, Theme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/components/navigators/Start.navigator';
import {Platform, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {refreshUser, selectorsUser} from './src/redux/user/userReducer';
import {actionsCart} from './src/redux/cart/cartReducer';
import service from './src/services/service';
import {useFormattingContext} from './src/context/FormattingContext';
import portmone from './src/utils/portmone';
import config from './src/config/config';
import loadRemoteConfig from './src/utils/loadRemoteConfig';
import validateVersion from './src/utils/validateVersion';
import {selectorsConfig} from './src/redux/config/configReducer';
import useDidUpdateEffect from './src/useHooks/useDidUpdateEffect';
import ModalUpdateApp from './src/components/modals/ModalUpdateApp';
import {actionsOther, selectorsOther} from './src/redux/other/otherReducer';
import ModalAssortment from './src/components/modals/ModalAssortment';
import {TypeDelivery} from './src/constants/constantsId';
import {actionsOrder, selectorsOrder} from './src/redux/order/orderReducer';
import {getSellPoints} from './src/redux/sellPoints/sellPointsReducer';
import getIsNotExistInPO from './src/useHooks/getIsNotExistInPO';
import getIsExistSellPoint from './src/useHooks/isExistSellPoint';
import useHandlerMessaging, {
  TypeHandlerMessaging,
} from './src/useHooks/useHandlerMessaging';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {getUniqueId} from 'react-native-device-info';
import {TitleTopics} from './src/typings/TypeTopic';
import {isIOS, isAndroid} from './src/utils/isPlatform';
import {requestNotificationPermission} from './src/utils/requestNotificationPermission';
import {Host} from 'react-native-portalize';
import {isReadyRef, navigationRef} from './src/utils/navigationRef';

const App = () => {
  const dispatch = useDispatch();
  const [isLoadConfig, setIsLoadConfig] = useState(false);
  const {theme, onChangeTheme, ...colors} = useTheme();
  const {currentLocale} = useFormattingContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isNeededEditName = useSelector(selectorsUser.isNeededEditName);
  const [isRefreshUser, setIsRefreshUser] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const tokenNotification = useSelector(selectorsOther.getTokenNotification);
  const requiredVersion = useSelector(selectorsConfig.getRequiredVersion);
  const optionalVersion = useSelector(selectorsConfig.getOptionalVersion);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
  const enabledRequiredCheck = useSelector(
    selectorsConfig.getItemConfig('enabledRequiredCheckVersion'),
  );
  const enabledOptionalCheck = useSelector(
    selectorsConfig.getItemConfig('enabledOptionalCheckVersion'),
  );
  const sellPoints = useSelector(getSellPoints(true));
  const switchHandlerMessaging = useHandlerMessaging();

  const handleCatchMessageOpenedApp = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    console.log(
      '------------------>    ' +
        (isIOS ? 'IOS' : 'ANDROID') +
        ': handleCatchMessageOpenedApp!',
      remoteMessage,
    );
    if (remoteMessage) {
      switchHandlerMessaging(TypeHandlerMessaging.openApp, remoteMessage);
    }
  };

  const handleMessage = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    console.log(
      '------------------>    ' +
        (isIOS ? 'IOS' : 'ANDROID') +
        ': handleMessage!',
      remoteMessage,
    );
    if (remoteMessage) {
      switchHandlerMessaging(TypeHandlerMessaging.message, remoteMessage);
    }
  };

  /// Notification handlers
  useEffect(() => {
    messaging().subscribeToTopic(TitleTopics.system);

    messaging().onNotificationOpenedApp(handleCatchMessageOpenedApp);
    if (isAndroid) {
      messaging().getInitialNotification().then(handleCatchMessageOpenedApp);
    }

    const unsubscribe = messaging().onMessage(handleMessage);

    const unsubscribeToken = messaging().onTokenRefresh(
      async (refreshToken) => {},
    );

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, []);

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
    dispatch(refreshUser).then((isAuth) => {
      setIsRefreshUser(true);
      if (isAuth) {
        service
          .getCart()
          .then((res) => {
            const {items, sellPoint, deliveryType} = res;
            if (!sellPoint || items.length === 0 || deliveryType === null) {
              return false;
            }
            if (deliveryType && deliveryType.code === TypeDelivery.express) {
              return false;
            }
            const allSellPoints = sellPoints;
            const isExistSellPoint = getIsExistSellPoint(
              allSellPoints,
              sellPoint.id,
            );

            if (!isExistSellPoint) {
              return false;
            }

            const isExistInPO = getIsNotExistInPO(items, sellPoint.id);
            if (isExistInPO) {
              return false;
            }
            dispatch(actionsCart.setData(items));
            dispatch(actionsCart.updateCart(sellPoint.id));
            dispatch(
              actionsOrder.setData({
                deliveryType,
                sellPoint:
                  deliveryType.code === TypeDelivery.self ? sellPoint.id : null,
                expressSellPoint: null,
              }),
            );

            return true;
          })
          .then((res) => {
            if (!res) {
              dispatch(
                actionsOther.setData({
                  isModalAssortment: true,
                }),
              );
            }
          });
      } else {
        dispatch(
          actionsOther.setData({
            isModalAssortment: deliveryType === null,
          }),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      portmone.invokePortmoneSdk({
        theme,
        lang: currentLocale,
        type: 'phone',
      });
    }
  }, []);

  useEffect(() => {
    handleNotificationPermission();
    loadConfig();
  }, []);

  const loadConfig = async () => {
    loadRemoteConfig(dispatch, false).then(async () => {
      setIsLoadConfig(true);
    });
  };

  useDidUpdateEffect(() => {
    if (isLoadConfig) {
      if (!validateVersion(requiredVersion) && enabledRequiredCheck) {
        setIsOpenModal(true);
        setIsRequired(true);
      } else if (!validateVersion(optionalVersion) && enabledOptionalCheck) {
        setIsOpenModal(true);
      }
    }
  }, [isLoadConfig]);

  const handleNotificationPermission = async () => {
    const res = (await requestNotificationPermission({
      alert: true,
      sound: true,
      criticalAlert: true,
      badge: true,
    })) as FirebaseMessagingTypes.AuthorizationStatus;

    if ([1, 2].some((n) => n === res)) {
      if (tokenNotification === null) {
        const id = await getUniqueId();
        const token = await messaging().getToken();
      }
    }
  };

  if (!isLoadConfig) {
    return null;
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={MyTheme}
      linking={{
        prefixes: [config.domen],
      }}>
      <StatusBar
        hidden={Platform.OS === 'android'}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ModalUpdateApp
        modalVisible={isOpenModal}
        isRequired={isRequired}
        onClose={() => setIsOpenModal(false)}
      />
      {isRefreshUser && !isNeededEditName && <ModalAssortment />}

      <StartNavigator />
    </NavigationContainer>
  );
};

export default App;
