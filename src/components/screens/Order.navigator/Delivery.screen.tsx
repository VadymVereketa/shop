import React from 'react';
import {DeliveryScreenProps} from '../../navigators/Order.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import BlockDelivery from '../../common/BlockDelivery';
import MyButton from '../../controls/MyButton';
import {StyleSheet, View} from 'react-native';
import {sizes} from '../../../context/ThemeContext';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {actionsOrder} from '../../../redux/order/orderReducer';
import {useDispatch} from 'react-redux';

const DeliveryScreen = ({navigation, route}: DeliveryScreenProps) => {
  const dispatch = useDispatch();
  const params = route.params || {};
  const paramAddressId = params.idAddress;
  const insets = useSafeAreaInsets();

  useDidUpdateEffect(() => {
    dispatch(
      actionsOrder.setData({
        addressId: paramAddressId,
      }),
    );
  }, [paramAddressId]);

  return (
    <SafeAreaView
      style={[
        styles.con,
        {
          marginTop: -insets.top,
        },
      ]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <BlockDelivery navigate={'Delivery'} />
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

export default DeliveryScreen;
