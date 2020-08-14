import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const MenuScreen = () => {
  return (
    <View style={[styles.container]}>
      <Text>MenuScreen</Text>
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

export default MenuScreen;
