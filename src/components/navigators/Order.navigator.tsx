import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {StackScreenProps} from '@react-navigation/stack/src/types';
import ProductScreen from '../screens/Secondary.navigator/Product.screen';
import {
  OrderNavigatorScreenProps,
  SecondaryNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import {ICartItem, IProduct} from '../../typings/FetchData';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import IconButton from '../controls/IconButton';
import {sizes, useTheme} from '../../context/ThemeContext';
import CommentCartScreen from '../screens/Secondary.navigator/CommentCart.screen';
import FirstStepScreen from '../screens/Order.navigator/FirstStep.screen';
import SecondStepScreen from '../screens/Order.navigator/SecondStep.screen';
import ThirdStepScreen from '../screens/Order.navigator/ThirdStep.screen';
import FinalStepScreen from '../screens/Order.navigator/FinalStep.screen';
import MyText from '../controls/MyText';
import {StyleSheet} from 'react-native';
import {getFontFamily} from '../../utils/getFontFamily';
import DateScreen from '../screens/Order.navigator/Date.screen';
import OrderContactScreen from '../screens/Order.navigator/OrderContact.screen';

export type OrderNavigatorParamList = {
  FirstStep: {};
  SecondStep: {};
  ThirdStep: {};
  FinalStep: {};
  Date: {};
  OrderContact: {};
};

export type FirstStepScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'FirstStep'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type FirstStepScreenRouteProp = RouteProp<OrderNavigatorParamList, 'FirstStep'>;

export type FirstStepScreenProps = {
  route: FirstStepScreenRouteProp;
  navigation: FirstStepScreenNavigationProp;
};

export type SecondStepScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'SecondStep'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type SecondStepScreenRouteProp = RouteProp<
  OrderNavigatorParamList,
  'SecondStep'
>;

export type SecondStepScreenProps = {
  route: SecondStepScreenRouteProp;
  navigation: SecondStepScreenNavigationProp;
};

export type ThirdStepScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'ThirdStep'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ThirdStepScreenRouteProp = RouteProp<OrderNavigatorParamList, 'ThirdStep'>;

export type ThirdStepScreenProps = {
  route: ThirdStepScreenRouteProp;
  navigation: ThirdStepScreenNavigationProp;
};

export type FinalStepScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'FinalStep'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type FinalStepScreenRouteProp = RouteProp<OrderNavigatorParamList, 'FinalStep'>;

export type FinalStepScreenProps = {
  route: FinalStepScreenRouteProp;
  navigation: FinalStepScreenNavigationProp;
};

export type OrderContactScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'OrderContact'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type OrderContactScreenRouteProp = RouteProp<
  OrderNavigatorParamList,
  'OrderContact'
>;

export type OrderContactScreenProps = {
  route: OrderContactScreenRouteProp;
  navigation: OrderContactScreenNavigationProp;
};

const Stack = createStackNavigator<OrderNavigatorParamList>();

const OrderNavigator = React.memo(({navigation}: OrderNavigatorScreenProps) => {
  const {text} = useTheme();
  return (
    <Stack.Navigator
      initialRouteName={'FirstStep'}
      screenOptions={{
        title: 'Оформлення замовлення',
        headerTruncatedBackTitle: '',
        headerBackTitle: '',
        headerLeft: (props) => {
          return (
            <IconButton
              style={{
                paddingLeft: sizes[5],
              }}
              onPress={props.onPress}
              icon={{
                name: 'arrow',
                size: sizes[10],
                fill: text,
              }}
            />
          );
        },
        headerTitleStyle: styles.title,
      }}>
      <Stack.Screen
        name="FirstStep"
        component={FirstStepScreen}
        options={{
          headerRight: () => {
            return <MyText style={styles.right}>1/3</MyText>;
          },
        }}
      />
      <Stack.Screen
        name="SecondStep"
        component={SecondStepScreen}
        options={{
          headerRight: () => {
            return <MyText style={styles.right}>2/3</MyText>;
          },
        }}
      />
      <Stack.Screen
        name="ThirdStep"
        component={ThirdStepScreen}
        options={{
          headerRight: () => {
            return <MyText style={styles.right}>3/3</MyText>;
          },
        }}
      />
      <Stack.Screen
        name="FinalStep"
        component={FinalStepScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Date"
        component={DateScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderContact"
        component={OrderContactScreen}
        options={{
          title: 'Одержувач замовлення',
        }}
      />
    </Stack.Navigator>
  );
});

const styles = StyleSheet.create({
  title: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
  },
  right: {
    fontSize: sizes[9],
    paddingRight: sizes[5],
  },
});

export default OrderNavigator;
