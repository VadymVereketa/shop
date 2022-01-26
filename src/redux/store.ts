import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from './reducer';
import thunkMiddleware from 'redux-thunk';
import {persistStore} from 'redux-persist';
import {Mode, mode} from '../config/config';
import {eventCatch} from '../context/EventReduxContext';

export default function configureStore() {
  const middlewares = [thunkMiddleware, eventCatch];

  const store = createStore(
    reducers,
    mode !== Mode.PROD
      ? composeWithDevTools(applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares),
  );

  const persistor = persistStore(store);

  return {store, persistor};
}
