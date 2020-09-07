import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {OrderContactScreenProps} from '../../navigators/Order.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FormContact from '../../forms/FormContact';
import {sizes} from '../../../context/ThemeContext';
import {IContact} from '../../../typings/FetchData';
import {useDispatch} from 'react-redux';
import {actionsOrder} from '../../../redux/order/orderReducer';

const OrderContactScreen = React.memo(
  ({navigation, route}: OrderContactScreenProps) => {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const handleOk = (contact: IContact) => {
      dispatch(
        actionsOrder.setData({
          contact,
        }),
      );
      navigation.goBack();
    };

    const handleCancel = () => {
      navigation.goBack();
    };

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            marginTop: -insets.top,
          },
        ]}>
        <FormContact onCancel={handleCancel} onOk={handleOk} />
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: sizes[5],
    paddingTop: sizes[5],
  },
});

export default OrderContactScreen;
