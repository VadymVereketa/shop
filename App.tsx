import {NavigationContainer, Theme} from '@react-navigation/native';
import React from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/components/navigators/Start.navigator';
import {Platform, StatusBar} from 'react-native';

const App = () => {
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
