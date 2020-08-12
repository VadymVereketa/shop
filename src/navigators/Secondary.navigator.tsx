import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import ProductScreen from '../screens/Product.screen';
import {SecondaryNavigatorScreenProps} from './Start.navigator';

export type SecondaryNavigatorParamList = {
  Product: {
  };
};

export type ProductScreenProps = StackScreenProps<
  SecondaryNavigatorParamList,
  'Product'
  >;

const Stack = createStackNavigator();

const SecondaryNavigator = (props: SecondaryNavigatorScreenProps) => {
  return (
      <Stack.Navigator initialRouteName={'Product'}>
        <Stack.Screen name="Product" component={ProductScreen} />
      </Stack.Navigator>
  );
};

export default SecondaryNavigator;
