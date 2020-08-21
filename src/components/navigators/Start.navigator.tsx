import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainNavigator from './Main.navigator';
import SecondaryNavigator from './Secondary.navigator';
import {StackScreenProps} from '@react-navigation/stack/src/types';
import AuthNavigator from './Auth.navigator';
import MenuNavigator from './Menu.navigator';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../redux/user/userReducer';
import OrderNavigator from './Order.navigator';

export type StartNavigatorParamList = {
  MainNavigator: {};
  SecondaryNavigator: {};
  AuthNavigator: {};
  MenuNavigator: {};
  OrderNavigator: {};
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

const Stack = createStackNavigator<StartNavigatorParamList>();

const StartNavigator = () => {
  const isAuth = useSelector(selectorsUser.isAuth);
  return (
    <Stack.Navigator initialRouteName={'MainNavigator'} headerMode="none">
      <Stack.Screen name="MainNavigator" component={MainNavigator} />
      <Stack.Screen name="SecondaryNavigator" component={SecondaryNavigator} />
      {!isAuth && (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
      <Stack.Screen name="MenuNavigator" component={MenuNavigator} />
      <Stack.Screen name="OrderNavigator" component={OrderNavigator} />
    </Stack.Navigator>
  );
};

export default StartNavigator;
