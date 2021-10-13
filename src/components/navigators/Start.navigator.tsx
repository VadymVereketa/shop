import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainNavigator from './Main.navigator';
import SecondaryNavigator from './Secondary.navigator';
import {StackScreenProps} from '@react-navigation/stack/src/types';
import AuthNavigator from './Auth.navigator';
import MenuNavigator from './Menu.navigator';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../redux/user/userReducer';
import OrderNavigator from './Order.navigator';
import {selectorsCart} from '../../redux/cart/cartReducer';
import AddressNavigator from './Address.navigator';
import {selectorsOrder} from '../../redux/order/orderReducer';
import FirebaseCrash from '../../Crashlytics/FirebaseCrash';

export type StartNavigatorParamList = {
  MainNavigator: {};
  SecondaryNavigator: {};
  AuthNavigator: {};
  MenuNavigator: {};
  OrderNavigator: {};
  AddressNavigator: {};
};

export type MainNavigatorScreenProps = StackScreenProps<
  StartNavigatorParamList,
  'MainNavigator'
>;

export type SecondaryNavigatorScreenProps = StackScreenProps<
  StartNavigatorParamList,
  'SecondaryNavigator'
>;

export type AuthNavigatorScreenProps = StackScreenProps<
  StartNavigatorParamList,
  'AuthNavigator'
>;

export type OrderNavigatorScreenProps = StackScreenProps<
  StartNavigatorParamList,
  'OrderNavigator'
>;

export type AddressNavigatorScreenProps = StackScreenProps<
  StartNavigatorParamList,
  'AddressNavigator'
>;

const Stack = createStackNavigator<StartNavigatorParamList>();

const StartNavigator = React.memo(() => {
  const user = useSelector(selectorsUser.getUser);
  const isAuth = useSelector(selectorsUser.isAuth);
  const count = useSelector(selectorsCart.getGeneralCount);
  const numberOrder = useSelector(selectorsOrder.getNumberOrder);

  useEffect(() => {
    if (isAuth && user) {
      FirebaseCrash.init(user!);
    }
  }, [isAuth]);

  return (
    <Stack.Navigator initialRouteName={'MainNavigator'} headerMode="none">
      <Stack.Screen name="MainNavigator" component={MainNavigator} />
      <Stack.Screen name="SecondaryNavigator" component={SecondaryNavigator} />
      {!isAuth && (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
      {isAuth && (
        <Stack.Screen name="MenuNavigator" component={MenuNavigator} />
      )}
      {isAuth && (count !== 0 || numberOrder !== null) && (
        <Stack.Screen name="OrderNavigator" component={OrderNavigator} />
      )}
      <Stack.Screen name="AddressNavigator" component={AddressNavigator} />
    </Stack.Navigator>
  );
});

export default StartNavigator;
