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
import {actionsOther} from './src/redux/other/otherReducer';
import ModalAssortment from './src/components/modals/ModalAssortment';
import {RootState} from './src/redux/reducer';
import {TypeDelivery} from './src/constants/constantsId';
import {actionsOrder} from './src/redux/order/orderReducer';
import {
  selectorSellPoint,
  getSellPoints,
} from './src/redux/sellPoints/sellPointsReducer';
import store from './src/redux/store';
import getIsNotExistInPO from './src/useHooks/getIsNotExistInPO';
import getIsExistSellPoint from './src/useHooks/isExistSellPoint';

const App = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectorsUser.isAuth);
  const [isLoadConfig, setIsLoadConfig] = useState(false);
  const {theme, onChangeTheme, ...colors} = useTheme();
  const {currentLocale} = useFormattingContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const requiredVersion = useSelector(selectorsConfig.getRequiredVersion);
  const optionalVersion = useSelector(selectorsConfig.getOptionalVersion);
  const enabledRequiredCheck = useSelector(
    selectorsConfig.getItemConfig('enabledRequiredCheckVersion'),
  );
  const enabledOptionalCheck = useSelector(
    selectorsConfig.getItemConfig('enabledOptionalCheckVersion'),
  );

  const expressSellPoints = useSelector(selectorSellPoint.getExpressSellPoints);
  const sellPoints = useSelector(getSellPoints(true));

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
    if (isAuth) {
      service
        .getCart()
        .then((res) => {
          const {items, sellPoint, deliveryType} = res;
          if (!sellPoint || items.length === 0 || deliveryType === null) {
            return false;
          }
          const allSellPoints = [...sellPoints, ...expressSellPoints];
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
              sellPoint: sellPoint.id,
              expressSellPoint:
                deliveryType.code === TypeDelivery.express ? sellPoint : null,
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
    }
  }, [isAuth]);

  useEffect(() => {
    dispatch(refreshUser);

    if (Platform.OS === 'android') {
      portmone.invokePortmoneSdk({
        theme,
        lang: currentLocale,
        type: 'phone',
      });
    }
  }, []);

  useEffect(() => {
    loadRemoteConfig(dispatch, false).then(() => {
      setIsLoadConfig(true);
    });
  }, []);

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
      <ModalUpdateApp
        modalVisible={isOpenModal}
        isRequired={isRequired}
        onClose={() => setIsOpenModal(false)}
      />
      <ModalAssortment />
      <StartNavigator />
    </NavigationContainer>
  );
};

export default App;
