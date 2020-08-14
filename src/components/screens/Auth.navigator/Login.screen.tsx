import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {LoginScreenProps} from '../../navigators/Auth.navigator';

const LoginScreen = (props: LoginScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>LoginScreen</Text>
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

export default LoginScreen;
