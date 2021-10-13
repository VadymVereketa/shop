import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RestaurantScreen from '../screens/Category.navigator/Restaurant.screen';
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
import {
  selectorCategory,
  selectorCategory2,
} from '../../redux/category/categoryReducer';
import t from '../../utils/translate';
import {selectorsConfig} from '../../redux/config/configReducer';
import {IFetchCategory} from '../../typings/ICategory';
import CategoryNavigator from './Category.navigator';
import TagsNavigator from './Tags.navigator';

export type MainNavigatorParamList = {
  Restaurant: {
    category: IFetchCategory;
  };
  Shop: {
    category: IFetchCategory;
  };
  Cart: {};
  Tag: {
    categories: {id: number; name: string}[];
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

type TagNavigatorNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Tag'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type TagNavigatorRouteProp = RouteProp<MainNavigatorParamList, 'Tag'>;

export type TagNavigatorProps = {
  route: TagNavigatorRouteProp;
  navigation: TagNavigatorNavigationProp;
};
const Tab = createBottomTabNavigator<MainNavigatorParamList>();

const MainNavigator = React.memo((props: MainNavigatorScreenProps) => {
  const categiesTags = useSelector(selectorCategory.getTags);
  const roots = useSelector(selectorCategory2.getRootCategories);

  useEffect(() => {
    if (roots.length > 0) {
      // @ts-ignore
      props.navigation.navigate('Restaurant', {
        categories: roots[0],
      });
    }
  }, [roots.length]);

  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={{
        unmountOnBlur: true,
      }}
      initialRouteName={'Restaurant'}
      tabBar={(props) => <TabBar {...props} />}>
      {roots.length > 0 && (
        <Tab.Screen
          key="Restaurant"
          name="Restaurant"
          initialParams={{
            category: roots[0],
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
          component={CategoryNavigator}
        />
      )}
      {roots.length > 0 && (
        <Tab.Screen
          key="Shop"
          name="Shop"
          initialParams={{
            category: roots[1],
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
          component={CategoryNavigator}
        />
      )}

      <Tab.Screen name="Cart" component={CartScreen} />
      {categiesTags.length > 0 && (
        <Tab.Screen
          name="Tag"
          initialParams={{
            categories: categiesTags,
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
          component={TagsNavigator}
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
