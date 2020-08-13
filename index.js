import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ProviderTheme from './src/context/ThemeContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Main = () => {
  return (
    <SafeAreaProvider>
      <ProviderTheme>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </ProviderTheme>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => Main);
