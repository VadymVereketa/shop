import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from './reducer';
import thunkMiddleware from 'redux-thunk';
import {persistStore} from 'redux-persist';
import {MODE} from '../config';

export default function configureStore() {
  const middlewares = [thunkMiddleware];

  const store = createStore(
    reducers,
    MODE === 'dev' || MODE === 'test'
      ? composeWithDevTools(applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares),
  );

  const persistor = persistStore(store);

  return {store, persistor};
}
