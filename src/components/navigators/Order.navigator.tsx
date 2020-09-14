import React, {useEffect} from 'react';
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
import {ICartItem, IProduct, IPurchase} from '../../typings/FetchData';
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
import DateScreen, {IOptionDate} from '../screens/Order.navigator/Date.screen';
import OrderContactScreen from '../screens/Order.navigator/OrderContact.screen';
import OrderAddressScreen from '../screens/Order.navigator/OrderAddress.screen';
import RepeatOrderScreen from '../screens/Order.navigator/RepeatOrder.screen';
import DeliveryScreen from '../screens/Order.navigator/Delivery.screen';
import {thunkGetTypes} from '../../redux/types/typeReducer';
import {useDispatch, useSelector} from 'react-redux';
import PaymentScreen from '../screens/Order.navigator/Payment.screen';
import service from '../../services/service';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';
import {actionsCart} from '../../redux/cart/cartReducer';
import {actionsOrder} from '../../redux/order/orderReducer';

export type OrderNavigatorParamList = {
  FirstStep: {};
  SecondStep: {
    idAddress?: number;
    option?: IOptionDate;
  };
  ThirdStep: {};
  FinalStep: {};
  Date: {
    options: IOptionDate[];
    navigate: any;
  };
  OrderContact: {};
  OrderAddress: {
    id: number;
    navigate: any;
  };
  RepeatOrder: {
    option?: IOptionDate;
  };
  Delivery: {
    idAddress?: number;
  };
  Payment: {};
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

export type DateScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'Date'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type DateScreenRouteProp = RouteProp<OrderNavigatorParamList, 'Date'>;

export type DateScreenProps = {
  route: DateScreenRouteProp;
  navigation: DateScreenNavigationProp;
};

export type OrderAddressScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'OrderAddress'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type OrderAddressScreenRouteProp = RouteProp<
  OrderNavigatorParamList,
  'OrderAddress'
>;

export type OrderAddressScreenProps = {
  route: OrderAddressScreenRouteProp;
  navigation: OrderAddressScreenNavigationProp;
};

export type RepeatOrderScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'RepeatOrder'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type RepeatOrderScreenRouteProp = RouteProp<
  OrderNavigatorParamList,
  'RepeatOrder'
>;

export type RepeatOrderScreenProps = {
  route: RepeatOrderScreenRouteProp;
  navigation: RepeatOrderScreenNavigationProp;
};

export type DeliveryScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'Delivery'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type DeliveryScreenRouteProp = RouteProp<OrderNavigatorParamList, 'Delivery'>;

export type DeliveryScreenProps = {
  route: DeliveryScreenRouteProp;
  navigation: DeliveryScreenNavigationProp;
};

export type PaymentScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'Payment'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type PaymentScreenRouteProp = RouteProp<OrderNavigatorParamList, 'Payment'>;

export type PaymentScreenProps = {
  route: PaymentScreenRouteProp;
  navigation: PaymentScreenNavigationProp;
};

const Stack = createStackNavigator<OrderNavigatorParamList>();

const OrderNavigator = React.memo(({navigation}: OrderNavigatorScreenProps) => {
  const dispatch = useDispatch();
  const draftId = useSelector(selectorsOther.getDraftId);
  const defaultSellPoint = useSelector(selectorsOther.getIdSellPoint);
  const {text} = useTheme();

  useEffect(() => {
    dispatch(thunkGetTypes);
    service.createDraft().then((res) => {
      if (res.success) {
        dispatch(
          actionsOther.setData({
            draftId: res.data.id,
          }),
        );
      }
    });

    return () => {
      dispatch(actionsCart.updateCart(defaultSellPoint));
      dispatch(
        actionsOrder.setData({
          sellPoint: null,
        }),
      );
    };
  }, []);

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
          title: 'Дата та час доставки',
        }}
      />
      <Stack.Screen
        name="OrderContact"
        component={OrderContactScreen}
        options={{
          title: 'Одержувач замовлення',
        }}
      />
      <Stack.Screen
        name="OrderAddress"
        component={OrderAddressScreen}
        options={{
          title: 'Обрати адресу',
        }}
      />
      <Stack.Screen
        name="RepeatOrder"
        component={RepeatOrderScreen}
        options={{
          title: 'Повторити замовлення',
        }}
      />
      <Stack.Screen
        name="Delivery"
        component={DeliveryScreen}
        options={{
          title: 'Спосіб отримання',
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: 'Cпосіб оплати',
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
