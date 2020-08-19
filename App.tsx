import {NavigationContainer, Theme} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/components/navigators/Start.navigator';
import {Platform, StatusBar} from 'react-native';
import {useDispatch} from 'react-redux';
import {refreshUser} from './src/redux/user/userReducer';

const App = () => {
  const dispatch = useDispatch();
  const {theme, onChangeTheme, ...colors} = useTheme();

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
