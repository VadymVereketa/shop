import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainNavigator from './Main.navigator';
import SecondaryNavigator from './Secondary.navigator';
import {StackScreenProps} from '@react-navigation/stack/src/types';
import AuthNavigator from './Auth.navigator';
import MenuNavigator from './Menu.navigator';

export type StartNavigatorParamList = {
  MainNavigator: {};
  SecondaryNavigator: {};
  AuthNavigator: {};
  MenuNavigator: {};
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

const Stack = createStackNavigator<StartNavigatorParamList>();

const StartNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'MainNavigator'} headerMode="none">
      <Stack.Screen name="MainNavigator" component={MainNavigator} />
      <Stack.Screen name="SecondaryNavigator" component={SecondaryNavigator} />
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      <Stack.Screen name="MenuNavigator" component={MenuNavigator} />
    </Stack.Navigator>
  );
};

export default StartNavigator;
