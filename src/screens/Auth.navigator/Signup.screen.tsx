import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {SignUpScreenProps} from '../../navigators/Auth.navigator';

const SignUpScreen = (props: SignUpScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>SignUpScreen</Text>
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

export default SignUpScreen;
