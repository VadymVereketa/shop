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
import {sizes, useTheme} from '../../context/ThemeContext';
import CommentCartScreen from '../screens/Secondary.navigator/CommentCart.screen';
import {MenuNavigatorParamList} from './Menu.navigator';
import ResultScreen from '../screens/Secondary.navigator/Result.screen';
import t from '../../utils/translate';

export type SecondaryNavigatorParamList = {
  Product: {
    product: IProduct;
    id: number;
  };
  CommentCart: {
    item: ICartItem;
  };
  Result: {
    title: string;
    navigator: string;
    screen: string;
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

/// Result props
type ResultScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<SecondaryNavigatorParamList, 'Result'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ResultScreenRouteProp = RouteProp<SecondaryNavigatorParamList, 'Result'>;

export type ResultScreenProps = {
  route: ResultScreenRouteProp;
  navigation: ResultScreenNavigationProp;
};
/// Result props

const Stack = createStackNavigator();

const SecondaryNavigator = React.memo(
  ({navigation}: SecondaryNavigatorScreenProps) => {
    const {text} = useTheme();
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
                  fill: text,
                }}
              />
            );
          },
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="CommentCart" component={CommentCartScreen} />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            title: t('profileResult'),
            headerLeft: () => null,
          }}
        />
      </Stack.Navigator>
    );
  },
);

export default SecondaryNavigator;
