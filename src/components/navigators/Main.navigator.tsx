import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RestaurantScreen from '../screens/Main.navigator/Restaurant.screen';
import {
  MainNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import CartScreen from '../screens/Main.navigator/Cart.screen';
import MenuScreen from '../screens/Main.navigator/Menu.screen';
import DesignIcon from '../common/DesignIcon';
import TabBar from '../common/TabBar';
import {useSelector} from 'react-redux';
import {selectorCategory} from '../../redux/category/categoryReducer';
import t from '../../utils/translate';

export type MainNavigatorParamList = {
  Restaurant: {
    categories: {id: number; name: string}[];
    isTag: boolean;
  };
  Shop: {
    categories: {id: number; name: string}[];
    isTag: boolean;
  };
  Cart: {};
  TagProducts: {
    categories: {id: number; name: string}[];
    isTag: boolean;
  };
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

type MenuScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Menu'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type MenuScreenRouteProp = RouteProp<MainNavigatorParamList, 'Menu'>;

export type MenuScreenProps = {
  route: MenuScreenRouteProp;
  navigation: MenuScreenNavigationProp;
};

type CartNavigatorNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Cart'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type CartNavigatorRouteProp = RouteProp<MainNavigatorParamList, 'Cart'>;

export type CartNavigatorProps = {
  route: CartNavigatorRouteProp;
  navigation: CartNavigatorNavigationProp;
};

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

const MainNavigator = React.memo((props: MainNavigatorScreenProps) => {
  const categiesRest = useSelector(selectorCategory.getRestaurant);
  const categiesShop = useSelector(selectorCategory.getShop);
  const categiesTags = useSelector(selectorCategory.getTags);

  useEffect(() => {
    if (categiesRest.length > 0) {
      // @ts-ignore
      props.navigation.navigate('Restaurant', {});
    }
  }, [categiesRest]);

  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
      }}
      initialRouteName={'Restaurant'}
      tabBar={(props) => <TabBar {...props} />}>
      {categiesRest.length > 0 && (
        <Tab.Screen
          name="Restaurant"
          initialParams={{
            categories: categiesRest,
            isTag: false,
          }}
          options={{
            title: t('tabBarRestaurant'),
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
      )}
      {categiesShop.length > 0 && (
        <Tab.Screen
          name="Shop"
          initialParams={{
            categories: categiesShop,
            isTag: false,
          }}
          options={{
            title: t('tabBarShop'),
            tabBarIcon: (props) => {
              return (
                <DesignIcon
                  name={'store'}
                  size={props.size}
                  fill={props.color}
                />
              );
            },
          }}
          component={RestaurantScreen}
        />
      )}
      <Tab.Screen name="Cart" component={CartScreen} />
      {categiesTags.length > 0 && (
        <Tab.Screen
          name="TagProducts"
          initialParams={{
            categories: categiesTags,
            isTag: true,
          }}
          options={{
            title: t('tabBarTagProducts'),
            tabBarIcon: (props) => {
              return (
                <DesignIcon
                  name={'sale'}
                  size={props.size}
                  fill={props.color}
                />
              );
            },
          }}
          component={RestaurantScreen}
        />
      )}
      <Tab.Screen
        name="Menu"
        options={{
          title: t('tabBarMenu'),
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
});

export default MainNavigator;
