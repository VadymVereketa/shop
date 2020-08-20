import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {StackScreenProps} from '@react-navigation/stack/src/types';
import ProductScreen from '../screens/Secondary.navigator/Product.screen';
import {
  SecondaryNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import {ICartItem, IProduct} from '../../typings/FetchData';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import IconButton from '../controls/IconButton';
import {sizes} from '../../context/ThemeContext';
import CommentCartScreen from '../screens/Secondary.navigator/CommentCart.screen';

export type SecondaryNavigatorParamList = {
  Product: {
    product: IProduct;
    id: number;
  };
  CommentCart: {
    item: ICartItem;
  };
};

export type ProductScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<SecondaryNavigatorParamList, 'Product'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ProductScreenRouteProp = RouteProp<SecondaryNavigatorParamList, 'Product'>;

export type ProductScreenProps = {
  route: ProductScreenRouteProp;
  navigation: ProductScreenNavigationProp;
};

const Stack = createStackNavigator();

const SecondaryNavigator = ({navigation}: SecondaryNavigatorScreenProps) => {
  return (
    <Stack.Navigator
      initialRouteName={'Product'}
      screenOptions={{
        title: '',
        headerTruncatedBackTitle: '',
        headerBackTitle: '',
        headerLeft: (props) => {
          return (
            <IconButton
              style={{
                paddingLeft: sizes[5],
              }}
              onPress={
                props.canGoBack
                  ? props.onPress
                  : () => navigation.push('MainNavigator', {})
              }
              icon={{
                name: 'arrow',
                size: sizes[10],
                fill: 'black',
              }}
            />
          );
        },
      }}>
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="CommentCart" component={CommentCartScreen} />
    </Stack.Navigator>
  );
};

export default SecondaryNavigator;
