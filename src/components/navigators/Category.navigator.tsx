import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  SecondaryNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import ProfileScreen from '../screens/Menu.navigator/Profile.screen';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {useTheme} from '../../context/ThemeContext';
import t from '../../utils/translate';
import {IFetchCategory} from '../../typings/ICategory';
import CategoryScreen from '../screens/Category.navigator/Category.screen';
import {RestaurantScreenProps} from './Main.navigator';
import RestaurantScreen from '../screens/Category.navigator/Restaurant.screen';
import MainHeader from '../headers/MainHeader';
import ProductsHeader from '../headers/ProductsHeader';

export type MenuNavigatorParamList = {
  Category: {
    treeCategory: IFetchCategory;
  };
  Products: {
    categories: IFetchCategory[];
    isTag: boolean;
    parentCategoryName?: string;
  };
};

/// Category props
type CategoryScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Category'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type CategoryScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Category'>;

export type CategoryScreenProps = {
  route: CategoryScreenRouteProp;
  navigation: CategoryScreenNavigationProp;
};

/// Products props
type ProductsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Products'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ProductsScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Products'>;

export type ProductsScreenProps = {
  route: ProductsScreenRouteProp;
  navigation: ProductsScreenNavigationProp;
};

const Stack = createStackNavigator<MenuNavigatorParamList>();

const CategoryNavigator = React.memo(
  ({navigation, route}: RestaurantScreenProps) => {
    const {text, background, border} = useTheme();

    return (
      <Stack.Navigator
        headerMode="screen"
        initialRouteName={'Category'}
        screenOptions={{}}>
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          initialParams={{
            treeCategory: route.params.category,
          }}
          options={{
            header: (props: any) => {
              return <MainHeader {...props} />;
            },
          }}
        />
        <Stack.Screen
          name="Products"
          component={RestaurantScreen}
          options={{
            header: (props: any) => <ProductsHeader {...props} />,
          }}
        />
      </Stack.Navigator>
    );
  },
);

export default CategoryNavigator;
