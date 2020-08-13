import React from 'react';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import LoginScreen from '../screens/Auth.navigator/Login.screen';
import SignUpScreen from '../screens/Auth.navigator/Signup.screen';
import {AuthNavigatorScreenProps, StartNavigatorParamList} from './Start.navigator';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';

export type AuthNavigatorParamList = {
  Login: {
  };
  SignUp: {
  };
};

type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthNavigatorParamList,'Login'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type LoginScreenRouteProp = RouteProp<AuthNavigatorParamList, 'Login'>;

export type LoginScreenProps = {
  route: LoginScreenRouteProp;
  navigation: LoginScreenNavigationProp;
}

type SignUpScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthNavigatorParamList,'SignUp'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type SignUpScreenRouteProp = RouteProp<AuthNavigatorParamList, 'SignUp'>;

export type SignUpScreenProps = {
  route: SignUpScreenRouteProp;
  navigation: SignUpScreenNavigationProp;
}

const Stack = createStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = (props: AuthNavigatorScreenProps) => {
  return (
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
  );
};

export default AuthNavigator;
