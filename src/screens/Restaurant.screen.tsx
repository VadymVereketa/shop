import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {RestaurantScreenProps} from '../navigators/Main.navigator';
import {fontSizes} from '../context/ThemeContext';

const RestaurantScreen = ({navigation, route}: RestaurantScreenProps) => {
  console.log(navigation)
  return (
    <View style={[styles.container]}>
      <Text style={{fontSize: fontSizes[10]}}>RestaurantScreen</Text>
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

export default RestaurantScreen;
