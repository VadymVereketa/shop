import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RestaurantScreen from '../screens/Main.navigator/Restaurant.screen';
import ShopScreen from '../screens/Main.navigator/Shop.screen';
import {
  MainNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import CartScreen from '../screens/Main.navigator/Cart.screen';
import TagProductsScreen from '../screens/Main.navigator/TagProducts.screen';
import MenuScreen from '../screens/Main.navigator/Menu.screen';
import DesignIcon from '../components/common/DesignIcon';
import TabBar from '../components/common/TabBar';

export type MainNavigatorParamList = {
  Restaurant: {};
  Shop: {};
  Cart: {};
  TagProducts: {};
  Menu: {};
};

type RestaurantScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Restaurant'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type RestaurantScreenRouteProp = RouteProp<
  MainNavigatorParamList,
  'Restaurant'
>;

export type RestaurantScreenProps = {
  route: RestaurantScreenRouteProp;
  navigation: RestaurantScreenNavigationProp;
};

type ShopScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Shop'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ShopScreenRouteProp = RouteProp<MainNavigatorParamList, 'Shop'>;

export type ShopScreenProps = {
  route: ShopScreenNavigationProp;
  navigation: ShopScreenRouteProp;
};

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

const MainNavigator = (props: MainNavigatorScreenProps) => {
  return (
    <Tab.Navigator
      initialRouteName={'Restaurant'}
      tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen
        name="Restaurant"
        options={{
          title: 'Ресторан',
          tabBarIcon: (props) => {
            return (
              <DesignIcon
                name={'restaurant'}
                size={props.size}
                fill={props.color}
              />
            );
          },
        }}
        component={RestaurantScreen}
      />
      <Tab.Screen
        name="Shop"
        options={{
          title: 'Магазин',
          tabBarIcon: (props) => {
            return (
              <DesignIcon name={'store'} size={props.size} fill={props.color} />
            );
          },
        }}
        component={ShopScreen}
      />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen
        name="TagProducts"
        options={{
          title: 'Пропозиций',
          tabBarIcon: (props) => {
            return (
              <DesignIcon name={'sale'} size={props.size} fill={props.color} />
            );
          },
        }}
        component={TagProductsScreen}
      />
      <Tab.Screen
        name="Menu"
        options={{
          title: 'Быльше',
          tabBarIcon: (props) => {
            return (
              <DesignIcon
                name={'menu-more'}
                size={props.size}
                fill={props.color}
                stroke={props.color}
              />
            );
          },
        }}
        component={MenuScreen}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
