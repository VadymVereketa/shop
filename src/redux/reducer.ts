import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {ICategoryState} from './category/categoryTypes';
import categoryReducer from './category/categoryReducer';
import cartReducer from './cart/cartReducer';
import {ICartState} from './cart/cartTypes';
import {IOtherState} from './other/otherTypes';
import otherReducer from './other/otherReducer';
import typesReducer from './types/typeReducer';
import {IUserState} from './user/userTypes';
import userReducer from './user/userReducer';
import {IOrderState} from './order/orderTypes';
import orderReducer from './order/orderReducer';
import {ISellPointsState} from './sellPoints/sellPointsTypes';
import sellPointsReducer from './sellPoints/sellPointsReducer';
import AsyncStorage from '@react-native-community/async-storage';
import {ITypeState} from './types/typeTypes';
import {IConfigState} from './config/configTypes';
import configReducer from './config/configReducer';

const otherPersistConfig = {
  key: 'other',
  storage: AsyncStorage,
  whitelist: ['searchQueries', 'locale', 'theme', 'settings', 'draftId'],
};

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['token'],
};

const categoryPersistConfig = {
  key: 'category',
  storage: AsyncStorage,
  whitelist: ['data', 'tags'],
};

const sellPointsPersistConfig = {
  key: 'sellPoints',
  storage: AsyncStorage,
  whitelist: ['data'],
};

const typesPersistConfig = {
  key: 'types',
  storage: AsyncStorage,
  whitelist: ['deliveryTypes', 'paymentTypes', 'pricesTypes'],
};

export interface RootState {
  category: ICategoryState;
  cart: ICartState;
  other: IOtherState;
  user: IUserState;
  order: IOrderState;
  sellPoints: ISellPointsState;
  types: ITypeState;
  config: IConfigState;
}

export default combineReducers({
  category: persistReducer(categoryPersistConfig, categoryReducer),
  cart: cartReducer,
  other: persistReducer(otherPersistConfig, otherReducer),
  user: persistReducer(userPersistConfig, userReducer),
  order: orderReducer,
  sellPoints: persistReducer(sellPointsPersistConfig, sellPointsReducer),
  types: persistReducer(typesPersistConfig, typesReducer),
  config: configReducer,
});
