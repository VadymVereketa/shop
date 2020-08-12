import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useTheme} from './src/context/ThemeContext';
import StartNavigator from './src/navigators/Start.navigator';


const App = () => {
  const {theme, onChangeTheme, ...colors} = useTheme();

  const MyTheme = {
    dark: theme === 'dark',
    colors,
  };

  return <NavigationContainer theme={MyTheme}>
    <StartNavigator />
  </NavigationContainer>;
};

export default App;
