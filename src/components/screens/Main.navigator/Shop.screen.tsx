import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ShopScreenProps} from '../../navigators/Main.navigator';

const ShopScreen = (props: ShopScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>ShopScreen</Text>
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

export default ShopScreen;
