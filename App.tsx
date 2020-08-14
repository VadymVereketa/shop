import {NavigationContainer, Theme} from '@react-navigation/native';
import React from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/components/navigators/Start.navigator';

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
      <StartNavigator />
    </NavigationContainer>
  );
};

export default App;
