import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const CartScreen = () => {
  return (
    <View style={[styles.container]}>
      <Text>CartScreen</Text>
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

export default CartScreen;
