import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {ICategoryState} from './category/categoryTypes';
import categoryReducer from './category/categoryReducer';
import cartReducer from './cart/cartReducer';
import {ICartState} from './cart/cartTypes';
import {IOtherState} from './other/otherTypes';
import otherReducer from './other/otherReducer';
import {IUserState} from './user/userTypes';
import userReducer from './user/userReducer';
import {IOrderState} from './order/orderTypes';
import orderReducer from './order/orderReducer';
import {ISellPointsState} from './sellPoints/sellPointsTypes';
import sellPointsReducer from './sellPoints/sellPointsReducer';
import AsyncStorage from '@react-native-community/async-storage';

const otherPersistConfig = {
  key: 'other',
  storage: AsyncStorage,
  whitelist: ['searchQueries', 'draftId', 'locale'],
};

export interface RootState {
  category: ICategoryState;
  cart: ICartState;
  other: IOtherState;
  user: IUserState;
  order: IOrderState;
  sellPoints: ISellPointsState;
}

export default combineReducers({
  category: categoryReducer,
  cart: cartReducer,
  other: persistReducer(otherPersistConfig, otherReducer),
  user: userReducer,
  order: orderReducer,
  sellPoints: sellPointsReducer,
});
