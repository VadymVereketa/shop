import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ChangePasswordScreenProps} from '../../navigators/Menu.navigator';

const ChangePasswordScreen = (props: ChangePasswordScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>ChangePasswordScreen</Text>
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

export default ChangePasswordScreen;
