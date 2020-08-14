import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ProviderTheme from './src/context/ThemeContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import configureStore from './src/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import ProviderFormattingContext from './src/context/FormattingContext';
import {thunkGetCustomCategories, thunkGetTags} from './src/redux/category/categoryReducer';

const store = configureStore();
store.store.dispatch(thunkGetCustomCategories);
store.store.dispatch(thunkGetTags);


const Main = () => {
  return (
    <Provider store={store.store}>
      <PersistGate loading={null} persistor={store.persistor}>
        <ProviderFormattingContext>
          <SafeAreaProvider>
            <ProviderTheme>
              <SafeAreaProvider>
                <App />
              </SafeAreaProvider>
            </ProviderTheme>
          </SafeAreaProvider>
        </ProviderFormattingContext>
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Main);
