import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './Main.navigator';
import SecondaryNavigator from './Secondary.navigator';
import {StackScreenProps} from '@react-navigation/stack/src/types';

export type StartNavigatorParamList = {
  MainNavigator: {
  };
  SecondaryNavigator: {
  };
};

export type MainNavigatorScreenProps = StackScreenProps<
  StartNavigatorParamList,
  'MainNavigator'
  >;

export type SecondaryNavigatorScreenProps = StackScreenProps<
  StartNavigatorParamList,
  'SecondaryNavigator'
  >;

const Stack = createStackNavigator<StartNavigatorParamList>();

const StartNavigator = () => {
  return (
      <Stack.Navigator initialRouteName={'MainNavigator'}>
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
        <Stack.Screen name="SecondaryNavigator" component={SecondaryNavigator} />
      </Stack.Navigator>
  );
};

export default StartNavigator;
