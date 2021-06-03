import {NavigationContainer, Theme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/components/navigators/Start.navigator';
import {Platform, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {refreshUser} from './src/redux/user/userReducer';
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

const App = () => {
  const dispatch = useDispatch();
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
      <StartNavigator />
    </NavigationContainer>
  );
};

export default App;
