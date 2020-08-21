import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  LocationScreenProps,
  OrdersScreenProps,
} from '../../navigators/Menu.navigator';

const OrdersScreen = (props: OrdersScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>OrdersScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrdersScreen;
