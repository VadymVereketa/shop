import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const ProductScreen = () => {
  return (
    <View style={[styles.container]}>
      <Text>ProductScreen</Text>
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

export default ProductScreen;
