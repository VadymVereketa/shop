import React from 'react';
import {
  DeliveryScreenProps,
  PaymentScreenProps,
} from '../../navigators/Order.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import BlockDelivery from '../../common/BlockDelivery';
import MyButton from '../../controls/MyButton';
import {StyleSheet, View} from 'react-native';
import {sizes} from '../../../context/ThemeContext';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {actionsOrder} from '../../../redux/order/orderReducer';
import {useDispatch} from 'react-redux';
import BlockPayment from '../../common/BlockPayment';

const PaymentScreen = ({navigation, route}: PaymentScreenProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        styles.con,
        {
          marginTop: -insets.top,
        },
      ]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <BlockPayment />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    paddingTop: sizes[10],
    marginHorizontal: sizes[5],
    justifyContent: 'space-between',
  },
});

export default PaymentScreen;
