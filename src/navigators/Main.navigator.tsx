import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs/src/types';
import RestaurantScreen from '../screens/Restaurant.screen';
import ShopScreen from '../screens/Shop.screen';
import {MainNavigatorScreenProps} from './Start.navigator';

export type MainNavigatorParamList = {
  Restaurant: {
  };
  Shop: {
  };
};

export type RestaurantScreenProps = BottomTabScreenProps<
  MainNavigatorParamList,
  'Restaurant'
  >;
export type ShopScreenProps = BottomTabScreenProps<
  MainNavigatorParamList,
  'Shop'
  >;

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

const MainNavigator = (props: MainNavigatorScreenProps) => {
  return (
      <Tab.Navigator initialRouteName={'Restaurant'}>
        <Tab.Screen name="Restaurant" component={RestaurantScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
      </Tab.Navigator>
  );
};

export default MainNavigator;
