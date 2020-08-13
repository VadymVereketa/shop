import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {LoyaltyCardScreenProps} from '../../navigators/Menu.navigator';

const LoyaltyCardScreen = (props: LoyaltyCardScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>LoyaltyCardScreen</Text>
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

export default LoyaltyCardScreen;
