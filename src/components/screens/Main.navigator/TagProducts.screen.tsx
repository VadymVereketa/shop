import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const TagProductsScreen = () => {
  return (
    <View style={[styles.container]}>
      <Text>TagProductsScreen</Text>
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

export default TagProductsScreen;
