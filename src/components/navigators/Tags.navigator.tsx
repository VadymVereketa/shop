import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {StartNavigatorParamList} from './Start.navigator';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {IFetchCategory} from '../../typings/ICategory';
import {RestaurantScreenProps, TagNavigatorProps} from './Main.navigator';
import RestaurantScreen from '../screens/Category.navigator/Restaurant.screen';
import ProductsHeader from '../headers/ProductsHeader';

export type MenuNavigatorParamList = {
  Products: {
    categories: IFetchCategory[];
    isTag: boolean;
    parentCategoryName?: string;
  };
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

const TagsNavigator = React.memo(({navigation, route}: TagNavigatorProps) => {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName={'Products'}
      screenOptions={{}}>
      <Stack.Screen
        name="Products"
        component={RestaurantScreen}
        initialParams={{
          categories: route.params.categories,
          isTag: true,
        }}
        options={{
          header: (props: any) => <ProductsHeader isBack={false} {...props} />,
        }}
      />
    </Stack.Navigator>
  );
});

export default TagsNavigator;
